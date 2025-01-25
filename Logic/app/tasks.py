import requests
from .run_project import Simulation, run_project

def init_tasks(celery):
    @celery.task
    def run_project(simulation: Simulation, callback_url):
        run_project(simulation)
        if callback_url:
            try:
                requests.post(callback_url, json={"status": "completed"})
            except requests.RequestException as e:
                return {"status": "failed to send callback", "error": str(e)}

        return {"status": "success"}