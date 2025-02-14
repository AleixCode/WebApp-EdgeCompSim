from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure  # Import the exception here

class MongoDB:
    def __init__(self):
        """Create an instance of MongoDB but don't initialize it yet"""
        self.mongo = PyMongo()

    def init_app(self, app):
        """Bind the Flask app to MongoDB"""
        self.mongo.init_app(app)

    def get_collection(self, collection_name):
        """Return a specific collection"""
        return self.mongo.db[collection_name]

    # 🔹 Utility Function: Find a User by id
    def find_user_by_id(self, id):
        """Find a user in the 'users' collection by id"""
        return self.get_collection("users").find_one({"id": id})

    # 🔹 Utility Function: Insert a New User
    def insert_user(self, user_data):
        """Insert a new user into the 'users' collection"""
        return self.get_collection("users").insert_one(user_data)

    def test_connection(self):
        """Test MongoDB connection and print status"""
        try:
            # Ping the database to check connection
            self.mongo.cx.admin.command('ping')
            print("✅ MongoDB Connection: OK")
            return True
        except ConnectionFailure:
            print("❌ MongoDB Connection: FAILED")
            return False


# Rename instance to `mongo` for consistency
mongo = MongoDB()
