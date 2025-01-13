from flask import Flask, jsonify, request
from app.tasks import run_simulation

app = Flask(__name__)

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json()
    iterations = data.get("iterations")
    precision = data.get("precision")
    callback_url = data.get("callback_url")  # URL where the result will be sent

    # Submit the Celery task with a callback URL
    task = run_simulation.apply_async(args=(iterations, precision, callback_url))

    return jsonify({"task_id": task.id}), 202  # HTTP 202 Accepted


