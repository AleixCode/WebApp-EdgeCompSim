from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

from app.celery_instance import init_celery
from app.routes import init_routes
from app.tasks import *
from app.config import Config
from app.mongo_instance import mongo  # Import the MongoDB instance

def create_app():
    app = Flask(__name__)

    # Cors Set Up
    CORS(app)
    
    # Flask configuration
    app.config.from_object(Config)

    # Initialize Celery with Flask app context
    init_celery(app)

    # Initialize MongoDB
    mongo.init_app(app)
    
    # Initialize Flask routes
    init_routes(app, mongo)
    
    return app

    