from flask import Flask
from app.celery_instance import init_celery
from .routes import init_routes
from .tasks import *

def create_app():
    app = Flask(__name__)
    
    # Flask configuration
    app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
    app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
    
    # Initialize Celery with Flask app context
    init_celery(app)
    
    # Initialize Flask routes
    init_routes(app)
    
    return app

    