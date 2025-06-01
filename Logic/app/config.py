import secrets

class Config:
    # MongoDB Configuration
    MONGO_URI = "mongodb://admin:secret@localhost:27016/database?authSource=admin"
    # Celery Configuration
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    # Frontend URI
    FRONTEND_URI = 'http://127.0.0.1:8100/api'
    BACKEND_URI = 'http://127.0.0.1:5000/api'
    # JWT
    JWT_SECRET_KEY = secrets.token_hex(32)       # used to sign JWTs:contentReference[oaicite:2]{index=2}
    JWT_TOKEN_LOCATION = ['cookies', 'headers']            # store JWTs in cookies:contentReference[oaicite:3]{index=3}
    JWT_COOKIE_SECURE = False                   # only for development (HTTPS otherwise):contentReference[oaicite:4]{index=4}
    JWT_COOKIE_CSRF_PROTECT = False             # disable CSRF protection for simplicity
    JWT_ACCESS_COOKIE_PATH = "/"        # sent on every request
    JWT_REFRESH_COOKIE_PATH = "/api/refresh" 
    JWT_COOKIE_CSRF_PROTECT = False     # or True + handle CSRF if you want
    JWT_ACCESS_TOKEN_EXPIRES =  300     # e.g. 5 minutes
    JWT_REFRESH_TOKEN_EXPIRES = 86400   # e.g. 1 day