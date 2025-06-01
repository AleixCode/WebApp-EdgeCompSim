import os
from flask import Blueprint, jsonify, request, send_file, abort

from flask_jwt_extended import (
    JWTManager, create_access_token, 
    set_access_cookies, unset_jwt_cookies,
    jwt_required, get_jwt_identity, get_jwt
)
from werkzeug.security import check_password_hash

from .tasks import run_project
from .Classes import Simulation, create_simulation_from_json
from .utils import get_directories

def init_routes(app, mongo):
    api = Blueprint("api", __name__, url_prefix="/api")

    @app.route('/api/me', methods=['GET'])
    @jwt_required()
    def me():
        user_id = get_jwt_identity()
        user = mongo.find_user_by_id(user_id)
        print(user)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        # Return user info (exclude password)
        return jsonify({
            "username": user.get("username"),
            "email": user.get("email"),
            "name": user.get("name", user.get("username", None)),
            "simulationsId": user.get("simulations_id", [])
        }), 200

    @api.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get("email", "")
        password = data.get("password", "")

        # Fetch user from your users collection
        user = mongo.find_user_by_email(email)
        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"msg": "Bad email or password"}), 401

        # create the JWT and set it in a cookie
        access_token = create_access_token(identity=str(user["_id"]))
        resp = jsonify({"msg": "Login successful"})
        set_access_cookies(resp, access_token)
        return resp, 200

    
    @api.route('/signup', methods=['POST'])
    def signup():
        """Sign up a new user using MongoHelper."""
        data = request.get_json() or {}
        name = data.get("name", "")
        password = data.get("password", "")
        email = data.get("email", "")

        if not email or not password or not name:
            return jsonify({"msg": "Missing email or name or password"}), 400

        # Check if the user already exists using MongoHelper
        if mongo.find_user_by_email(email):
            return jsonify({"msg": "User already exists"}), 400

        # Create the user using MongoHelper
        new_user = mongo.create_user(name, password, email)

        # Generate JWT token and set in response cookies
        access_token = create_access_token(identity=str(new_user["_id"]))
        resp = jsonify({"msg": "Signup successful"})
        set_access_cookies(resp, access_token)
        
        return resp, 201

    # LOGOUT: clear the JWT cookie
    @api.route('/logout', methods=['POST'])
    def logout():
        resp = jsonify({"msg": "Logout successful"})
        unset_jwt_cookies(resp)
        return resp, 200

    # A small helper to enforce login on simulation endpoints
    def protected(route):
        return jwt_required(route)

    # POST: Create a new simulation (protected)
    @api.route('/simulations', methods=['POST'])
    @jwt_required()
    def create_simulation():
        data = request.get_json() or {}
        simulation: Simulation = create_simulation_from_json(data)
        simulation.status = "Pending"  # Not "Running" yet

        # Get user info
        user_id = get_jwt_identity()
        user = mongo.find_user_by_id(user_id)
        if not user:
            abort(404, description="User not found")

        # Save to Mongo
        simulation = mongo.create_simulation(simulation=simulation)

        # Update user's simulations list
        sims = user.get("simulations_id") or []
        if not isinstance(sims, list):
            sims = []
        if simulation.id not in sims:
            sims.append(simulation.id)
            mongo.update_user(user_id, {"simulations_id": sims})

        return jsonify({"simulation_id": simulation.id}), 201

    @api.route('/simulations/<sim_id>/run', methods=['POST'])
    @jwt_required()
    def run_simulation(sim_id):
        # Retrieve the simulation
        simulation = mongo.get_simulation(sim_id)
        if simulation is None:
            abort(404, description="Simulation not found")

        payload = simulation.copy()
        # 1) Turn the Mongo _id into a str
        payload['id'] = str(payload.pop('_id'))

        # Check that the user owns it
        user_id = get_jwt_identity()
        user = mongo.find_user_by_id(user_id)
        if not user or sim_id not in (user.get("simulations_id") or []):
            abort(403, description="Not authorized to run this simulation")

        # Mark as running
        mongo.update_simulation(sim_id, {"status": "Running"})

        # Start async task
        callback_url = request.url_root
        task = run_project.apply_async(
            args=(payload, user_id),
            kwargs={'callback_url': callback_url}
        )

        return jsonify({"task_id": task.id, "simulation_id": sim_id}), 202

    # GET: Retrieve a simulation by id (protected)
    @api.route('/simulations/<sim_id>', methods=['GET'])
    @jwt_required()
    def get_simulation(sim_id):
        simulation = mongo.get_simulation(sim_id)
        if simulation is None:
            abort(404, description="Simulation not found")
        if '_id' in simulation:
            simulation['id'] = str(simulation['_id'])
            del simulation['_id']
        return jsonify(simulation), 200

    # PUT: Update an existing simulation (protected)
    @api.route('/simulations/<sim_id>', methods=['PUT'])
    @jwt_required()
    def update_simulation(sim_id):
        update_data = request.get_json() or {}

        if not update_data:
            abort(400, description="No valid fields to update")

        # Ensure user owns the simulation
        user_id = get_jwt_identity()
        user = mongo.find_user_by_id(user_id)
        if not user or sim_id not in (user.get("simulations_id") or []):
            abort(403, description="Not authorized to modify this simulation")

        # Ensure status-related fields are reset
        update_data["status"] = "Saved"
        update_data["result"] = None
        update_data["logs"] = None

        # Apply update
        modified_count = mongo.update_simulation(sim_id, update_data)
        if modified_count == 0:
            abort(404, description="Simulation not found or no changes applied")

        # Get and sanitize updated simulation
        updated_sim = mongo.get_simulation(sim_id)
        if not updated_sim:
            abort(404, description="Simulation not found after update")

        updated_sim["id"] = str(updated_sim["_id"])
        del updated_sim["_id"]

        return jsonify(updated_sim), 200


    @api.route('/simulations/<sim_id>', methods=['DELETE'])
    @jwt_required()
    def delete_simulation(sim_id):
        deleted_count = mongo.delete_simulation(sim_id)
        if deleted_count == 0:
            abort(404, description="Simulation not found")

        user_id = get_jwt_identity()
        user = mongo.find_user_by_id(user_id)
        if not user or sim_id not in (user.get("simulations_id") or []):
            abort(403, description="Not authorized to modify this simulation")

        # Remove sim_id from user's simulations_id array
        updated_simulations = [sid for sid in user.get("simulations_id", []) if sid != sim_id]
        mongo.update_user(user_id, {"simulations_id": updated_simulations})

        return jsonify({"message": "Simulation deleted"}), 200


    # Public status endpoint
    @api.route('/', methods=['GET'])
    def home():
        return jsonify({"message": "API is working"}), 200

    # Download (protected)
    @api.route("/download", methods=['GET'])
    @jwt_required()
    def download_file():
        filename = request.args.get("filename")
        sim_id = request.args.get("sim_id")
        file_path = os.path.abspath(f"./app/Simulations/{sim_id}/outputs/{filename}")
        if not os.path.exists(file_path):
            abort(404, description="File not found")
        return send_file(file_path, as_attachment=True)

    @api.route("/testdb", methods=['GET'])
    def test_db():
        if mongo.test_connection():
            return jsonify({"status": "✅ MongoDB Connection: OK"}), 200
        else:
            return jsonify({"status": "❌ MongoDB Connection: FAILED"}), 500

    app.register_blueprint(api)