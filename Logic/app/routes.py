import os
from flask import Blueprint, jsonify, request, send_file, abort
from .tasks import run_project
from .Classes import Simulation, create_simulation_from_json
from .utils import get_directories

def init_routes(app, mongo):
    api = Blueprint("api", __name__, url_prefix="/api")

    # POST: Create a new simulation
    @api.route('/simulate', methods=['POST'])
    def create_simulation():
        data = request.get_json()
        simulation: Simulation = create_simulation_from_json(data)
        # Insert the simulation into the database; the simulation now has a DB-assigned id
        simulation = mongo.create_simulation(simulation=simulation)
        
        # Build a callback URL for the task (if needed)
        callback_url = request.url_root  
        task = run_project.apply_async(args=(simulation.to_dict(),), kwargs={'callback_url': callback_url})
        
        return jsonify({"task_id": task.id, "simulation_id": simulation.id}), 202

    # GET: Retrieve a simulation by id
    @api.route('/simulate/<sim_id>', methods=['GET'])
    def get_simulation(sim_id):
        print("The simulation id to get is" + sim_id)
        if sim_id is None:
            abort(400, description="Simulation id expected found")
        simulation = mongo.get_simulation(sim_id)
        if simulation is None:
            abort(404, description="Simulation not found")
        return jsonify(simulation), 200

    # PUT: Update an existing simulation
    @api.route('/simulate/<sim_id>', methods=['PUT'])
    def update_simulation(sim_id):
        update_data = request.get_json()
        modified_count = mongo.update_simulation(sim_id, update_data)
        if modified_count == 0:
            abort(404, description="Simulation not found or no changes applied")
        # Optionally, return the updated simulation
        simulation = mongo.get_simulation(sim_id)
        return jsonify(simulation), 200

    # DELETE: Remove a simulation
    @api.route('/simulate/<sim_id>', methods=['DELETE'])
    def delete_simulation(sim_id):
        deleted_count = mongo.delete_simulation(sim_id)
        if deleted_count == 0:
            abort(404, description="Simulation not found")
        return jsonify({"message": "Simulation deleted"}), 200

    # Other endpoints
    @api.route('/', methods=['GET'])
    def home():
        return jsonify({"message": "API is working"}), 200

    @api.route("/download", methods=['GET'])
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
