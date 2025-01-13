#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <input_dir> <output_dir> <test_dir> <simulator_id> <>"
    echo "Example: ./run_with_inputs.sh /path/to/input /path/to/output /path/to/test 1"
    exit 1
fi

# Define the directories to mount from arguments
INPUT_DIR="$1"
OUTPUT_DIR="$2"
TEST_DIR="$3"
INSTANCE_ID="$4"
BASE_PORT="27017"

# Generate a unique name and port for the MongoDB container
MONGO_CONTAINER_NAME="mongo_${INSTANCE_ID}"
MONGO_PORT=$((BASE_PORT + INSTANCE_ID))

# Start a MongoDB container with a unique port
echo "Starting MongoDB container $MONGO_CONTAINER_NAME on port $MONGO_PORT..."
docker run -d --rm \
    --name "$MONGO_CONTAINER_NAME" \
    -p "$MONGO_PORT:27017" \
    mongo:5.0

# Wait for MongoDB to initialize by checking if it's ready to accept connections
echo "Waiting for MongoDB to start on port $MONGO_PORT..."
until docker exec "$MONGO_CONTAINER_NAME" mongo --eval "print('MongoDB is ready')" > /dev/null 2>&1; do
    sleep 1
done
echo "MongoDB is ready."

# Run the application container with the mounts and dynamic MongoDB connection
echo "Running the application container..."
docker run --rm \
    -e MONGO_URI="mongodb://localhost:$MONGO_PORT" \
    -v "$INPUT_DIR:/app/input" \
    -v "$OUTPUT_DIR:/app/output" \
    -v "$TEST_DIR:/app/test" \
    python-docker-app

# Stop the MongoDB container after the app finishes
echo "Stopping MongoDB container..."
docker stop "$MONGO_CONTAINER_NAME"
