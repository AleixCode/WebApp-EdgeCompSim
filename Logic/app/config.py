
class Config:
    # MongoDB Configuration
    MONGO_URI = "mongodb://admin:secret@localhost:27016/database?authSource=admin"
    # Celery Configuration
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'