import requests
from .run_project import Simulation, run_project as actual_run_project
from app.celery_instance import celery
from .Classes import Simulation, from_dict
from .utils import parse_results
from .config import Config
from flask_jwt_extended import create_access_token
from pymongo import MongoClient
from bson.objectid import ObjectId

_client = MongoClient(Config.MONGO_URI)
_db = _client.get_default_database()   

@celery.task
def run_project(simulation_data: dict, user_id: str, callback_url: str):
    # --- Rebuild and run the simulation locally ---
    simulation: Simulation = from_dict(simulation_data)
    actual_run_project(simulation)
    logs, results = parse_results(simulation.id, simulation.name)

    # --- Direct DB update of the simulation document ---
    update_data = {"result": results, "logs": logs}
    sim_oid = ObjectId(simulation.id)
    sim_result = _db.simulations.update_one(
        {"_id": sim_oid},
        {"$set": update_data}
    )
    if sim_result.matched_count == 0:
        return {"status": "failed", "error": "Simulation not found"}
    return {"status": "success"}
