from flask import Flask
from celery import Celery
from routes import init_routes
from tasks import init_tasks

def create_celery_app(app=None):
    app = app or Flask(__name__)
    app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
    app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    return celery

def create_app():
    app = Flask(__name__)
    celery = create_celery_app(app)
    init_routes(app)
    init_tasks(celery)
    return app, celery
