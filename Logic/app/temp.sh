#!/bin/bash

# Ensure correct number of arguments
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <input_dir> <output_dir> <test_dir> <simulator_id>"
    echo "Example: ./run_with_inputs.sh ./Simulations/1/input ./Simulations/1/output ./Simulations/1/test 1"
    exit 1
fi

# Define the directories and instance ID
INPUT_DIR="$1"
OUTPUT_DIR="$2"
TEST_DIR="$3"
INSTANCE_ID="$4"

# Define unique container names
NETWORK_NAME="app_network"
MONGO_CONTAINER_NAME="mongo_${INSTANCE_ID}"
APP_CONTAINER_NAME="app_${INSTANCE_ID}"

# Create a custom network if it doesn't exist
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    echo "Creating Docker network $NETWORK_NAME..."
    docker network create "$NETWORK_NAME"
fi

# Start a MongoDB container inside the network
echo "Starting MongoDB container $MONGO_CONTAINER_NAME..."
docker run -d --rm \
    --name "$MONGO_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    mongo:5.0 --bind_ip_all

# Wait for MongoDB to fully initialize
echo "Waiting for MongoDB to start..."
until docker exec "$MONGO_CONTAINER_NAME" mongo --eval "db.runCommand({ ping: 1 })" &>/dev/null; do
    sleep 1
done
echo "MongoDB is ready."

# Run the application container inside the network
echo "Running the application container as $APP_CONTAINER_NAME..."
docker run --rm \
    --name "$APP_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -e MONGO_URI="mongodb://$MONGO_CONTAINER_NAME:27017" \
    -v "$INPUT_DIR:/app/inputs" \
    -v "$OUTPUT_DIR:/app/outputs" \
    -v "$TEST_DIR:/app/tests" \
    python-docker-app

# Stop the MongoDB container after the app finishes
echo "Stopping MongoDB container $MONGO_CONTAINER_NAME..."
docker stop "$MONGO_CONTAINER_NAME"
