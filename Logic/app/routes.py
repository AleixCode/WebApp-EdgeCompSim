from flask import Flask, jsonify, request, send_file, abort
from .tasks import run_project
from .Classes import Simulation, create_simulation_from_json
from .utils import get_directories
import os


def init_routes(app, mongo):
    @app.route('/simulate', methods=['POST'])
    def simulate():
        # Get the incoming JSON data
        data = request.get_json()
        
        # Create the simulation object from the JSON data
        simulation: Simulation = create_simulation_from_json(data)
        
        # Get the current request URL and modify it for the callback
        callback_url = request.url_root  # Add the desired endpoint for the callback
        
        # Submit the Celery task with the callback URL
        task = run_project.apply_async(args=(simulation.to_dict(),), kwargs={'callback_url': callback_url})        
        
        # Respond with the task ID to acknowledge the request
        return jsonify({"task_id": task.id}), 202  # HTTP 202 Accepted

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({"works": 12}), 202  # HTTP 202 Accepted


    @app.route("/download")
    def download_file():
        filename = request.args.get("filename")
        sim_id = request.args.get("sim_id")
         
        # Construct correct path
        file_path = os.path.abspath(f"./app/Simulations/{sim_id}/outputs/{filename}")

        # Check if file exists before sending
        if not os.path.exists(file_path):
            abort(404, description="File not found")

        return send_file(file_path, as_attachment=True)

    
    @app.route("/testdb")
    def test_db():
        """Test the MongoDB connection using the MongoDB class function"""
        if mongo.test_connection():
            return jsonify({"status": "✅ MongoDB Connection: OK"}), 200
        else:
            return jsonify({"status": "❌ MongoDB Connection: FAILED"}), 500