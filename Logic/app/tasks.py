import requests
from .run_project import Simulation, run_project as actual_run_project
from app.celery_instance import celery
from .Classes import Simulation, from_dict

@celery.task
def run_project(simulation_data: dict, callback_url):
    """Celery task to run a project simulation."""
    # Recreate the Simulation object from the dictionary
    simulation: Simulation = from_dict(simulation_data)

    # Call the actual simulation logic
    actual_run_project(simulation)  # Use the imported function, not the Celery task

    # Perform the callback if the URL is provided
    if callback_url:
        try:
            requests.post(callback_url, json={"status": "completed"})
        except requests.RequestException as e:
            return {"status": "failed to send callback", "error": str(e)}

    return {"status": "success"}
