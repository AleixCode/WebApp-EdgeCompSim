from celery import Celery
from .config import Config

celery = Celery('app', broker=Config.CELERY_BROKER_URL, backend=Config.CELERY_RESULT_BACKEND) # Only initialize Celery here

def init_celery(app):
    """Initialize Celery with Flask app configuration"""
    celery.set_default()