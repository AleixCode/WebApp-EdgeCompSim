
class Config:
    # MongoDB Configuration
    MONGO_URI = "mongodb://admin:secret@localhost:27016/database?authSource=admin"
    # Celery Configuration
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    # Frontend URI
    FRONTEND_URI = 'http://127.0.0.1:8000/api'
    BACKEND_URI = 'http://127.0.0.1:5000/api'