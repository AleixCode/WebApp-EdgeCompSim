from flask import Flask, jsonify, request
from .tasks import run_project
from .Classes import Simulation, create_simulation_from_json


def init_routes(app):
    @app.route('/simulate', methods=['POST'])
    def simulate():
        # Get the incoming JSON data
        data = request.get_json()
        
        # Create the simulation object from the JSON data
        simulation: Simulation = create_simulation_from_json(data)
        
        # Get the current request URL and modify it for the callback
        callback_url = request.url_root + 'callback'  # Add the desired endpoint for the callback
        
        # Submit the Celery task with the callback URL
        task = run_project.apply_async(args=(simulation,), kwargs={'callback_url': callback_url})
        
        # Respond with the task ID to acknowledge the request
        return jsonify({"task_id": task.id}), 202  # HTTP 202 Accepted
    
    