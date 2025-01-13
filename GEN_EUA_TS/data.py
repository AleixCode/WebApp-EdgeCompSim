import pymongo
import os

# Create a MongoDB database and two collections
class Data:

    def __init__(self):
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        self.client = pymongo.MongoClient(mongo_uri)

        if "EUA_db" in self.client.list_database_names():
            self.client.drop_database("EUA_db")
        self.db = self.client["EUA_db"]

        # Create two collections (tables)
        self.server_data = self.db["servers_data"]
        self.user_data = self.db["users_data"]
        self.event_data = self.db["events_data"]

     # Insert data into the "server_data" collection
    def insert(self,data,table):
        if table == "server":
            self.server_data.insert_one(data)
        elif table == "user":
            self.user_data.insert_one(data)
        elif table == "event":
            self.event_data.insert_one(data)

    # Query data from the "server_data" collection
    def query_trace(self,table):
        if table == "server":
            return self.server_data.find()
        elif table == "user":
            return self.user_data.find()
        elif table == "event":
            return self.event_data.find()


    # Close the MongoDB connection
    def close(self):
        self.client.close()


# collection2 = db["products"]
#
# # Insert data into the "users" collection
# user_data = {
#     "username": "user1",
#     "email": "user1@example.com",
#     "age": 30
# }
# user_id = collection1.insert_one(user_data).inserted_id
#
# # Insert data into the "products" collection
# product_data = {
#     "name": "Product A",
#     "price": 19.99
# }
# product_id = collection2.insert_one(product_data).inserted_id
#
# # Query data from the "users" collection
# user_query = {"username": "user1"}
# user_result = collection1.find_one(user_query)
# print("User Data:")
# print(user_result)
#
# # Query data from the "products" collection
# product_query = {"name": "Product A"}
# product_result = collection2.find_one(product_query)
# print("\nProduct Data:")
# print(product_result)
#
# # Update data in the "users" collection
# new_age = 31
# update_query = {"username": "user1"}
# new_data = {"$set": {"age": new_age}}
# collection1.update_one(update_query, new_data)
#
# # Query and print the updated user data
# user_result = collection1.find_one(user_query)
# print("\nUpdated User Data:")
# print(user_result)
#
# # Close the MongoDB connection
# client.close()