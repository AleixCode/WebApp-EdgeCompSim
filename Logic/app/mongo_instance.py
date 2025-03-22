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
        return self.get_collection("users").find_one({"id": id})

    # 🔹 Utility Function: Insert a New User
    def insert_user(self, user_data):
        """Insert a new user into the 'users' collection"""
        return self.get_collection("users").insert_one(user_data)


    # 🔹 Simulations

    def create_simulation(self, simulation):
        """
        Insert a new simulation into the 'simulations' collection.
        
        :param simulation: An instance of Simulation.
        :return: The inserted document's ID.
        """
        simulation_data = simulation.to_dict()
        result = self.get_collection("simulations").insert_one(simulation_data)
        return result.inserted_id

    def get_simulation(self, sim_id):
        """
        Retrieve a simulation by its id from the 'simulations' collection.
        
        :param sim_id: The simulation's id (should match the simulation's "id" field).
        :return: The simulation document if found, else None.
        """
        return self.get_collection("simulations").find_one({"id": sim_id})

    def update_simulation(self, sim_id, update_data):
        """
        Update an existing simulation in the 'simulations' collection.
        
        :param sim_id: The simulation's id.
        :param update_data: A dictionary containing the fields to update.
        :return: The number of documents modified.
        """
        result = self.get_collection("simulations").update_one({"id": sim_id}, {"$set": update_data})
        return result.modified_count

    def delete_simulation(self, sim_id):
        """
        Delete a simulation from the 'simulations' collection by its id.
        
        :param sim_id: The simulation's id.
        :return: The number of documents deleted.
        """
        result = self.get_collection("simulations").delete_one({"id": sim_id})
        return result.deleted_count

# Rename instance to `mongo` for consistency
mongo = MongoDB()
