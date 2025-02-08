from celery import Celery

celery = Celery('app', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0') # Only initialize Celery here

def init_celery(app):
    """Initialize Celery with Flask app configuration"""
    celery.set_default()