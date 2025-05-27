from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure  # Import the exception here
from .Classes import Simulation
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash
from bcrypt import checkpw

class MongoDB:
    def __init__(self):
        """Create an instance of MongoDB but don't initialize it yet"""
        self.mongo = PyMongo()

    def get_oid(self, id):
        try:
            return ObjectId(id)
        except Exception as e:
            return None  # Or handle the error appropriately

    def init_app(self, app):
        """Bind the Flask app to MongoDB"""
        self.mongo.init_app(app)

    def get_collection(self, collection_name):
        """Return a specific collection"""
        return self.mongo.db[collection_name]

    
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

    # 🔹 Users

    # 🔹 Utility Function: Find a User by id
    def find_user_by_id(self, id):
        """Find a user in the 'users' collection by id"""
        oid = self.get_oid(id)
        return self.get_collection("users").find_one({"_id": oid})

    # 🔹 Utility Function: Insert a New User
    def insert_user(self, user_data):
        """Insert a new user into the 'users' collection"""
        return self.get_collection("users").insert_one(user_data)

    # Utility Function: Insert a New User with password hashing
    def create_user(self, username: str, password: str, email: str):
        """Create a new user by hashing the password and inserting into the 'users' collection."""
        password_hash = generate_password_hash(password)
        user_data = {
            "username": username,
            "password_hash": password_hash,
            "email": email
            # Add other default fields as needed
        }
        result = self.get_collection("users").insert_one(user_data)
        # Optionally, you can attach the inserted "_id" to the user_data before returning it if needed.
        user_data["_id"] = result.inserted_id
        return user_data

    def update_user(self, user_id, update_data):
        """
        Update an existing user in the 'users' collection.
        
        :param user_id: The users's id.
        :param update_data: A dictionary containing the fields to update.
        :return: The number of documents modified.
        """
        oid = self.get_oid(user_id)
        result = self.get_collection("users").update_one({"_id": oid}, {"$set": update_data})
        return result.modified_count

    def find_user_by_email(self, email: str):
        """Find a user in the 'users' collection by email and verify password"""
        users_collection = self.get_collection("users")

        # Find the user by email
        user_data = users_collection.find_one({"email": email})
        
        if not user_data:
            return None  # No user found

        return user_data  # Return user details if authentication succeeds


    # 🔹 Simulations

    def create_simulation(self, simulation: Simulation):
        """
        Insert a new simulation into the 'simulations' collection.
        :param simulation: An instance of Simulation (with id optional).
        :return: The updated simulation with the DB-generated id.
        """
        simulation_data = simulation.to_dict()
        result = self.get_collection("simulations").insert_one(simulation_data)
        # Update the simulation instance with the generated id
        simulation.id = str(result.inserted_id)
        return simulation


    def get_simulation(self, sim_id):
        """
        Retrieve a simulation by its id from the 'simulations' collection.
        
        :param sim_id: The simulation's id (should match the simulation's "_id" field).
        :return: The simulation document if found, else None.
        """
        print("Mongo sim id = " + sim_id)
        oid = self.get_oid(sim_id)
        print("Mongo sim oid = ")
        print(oid)
        return self.get_collection("simulations").find_one({"_id": oid})

    def update_simulation(self, sim_id, update_data):
        """
        Update an existing simulation in the 'simulations' collection.
        
        :param sim_id: The simulation's id.
        :param update_data: A dictionary containing the fields to update.
        :return: The number of documents modified.
        """
        oid = self.get_oid(sim_id)
        result = self.get_collection("simulations").update_one({"_id": oid}, {"$set": update_data})
        return result.modified_count

    def delete_simulation(self, sim_id):
        """
        Delete a simulation from the 'simulations' collection by its id.
        
        :param sim_id: The simulation's id.
        :return: The number of documents deleted.
        """
        oid = self.get_oid(sim_id)
        result = self.get_collection("simulations").delete_one({"_id": oid})
        return result.deleted_count

# Rename instance to `mongo` for consistency
mongo = MongoDB()
