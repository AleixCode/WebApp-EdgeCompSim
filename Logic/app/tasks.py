from app import create_celery_app
import requests
from run_project import Simulation, run_project


celery = create_celery_app()


@celery.task
def run_simulation(simulation: Simulation, callback_url):
    run_project(simulation)
    if callback_url:
        try:
            requests.post(callback_url, json={"status": "completed"})
        except requests.RequestException as e:
            return {"status": "failed to send callback", "error": str(e)}

    return {"status": "success"}