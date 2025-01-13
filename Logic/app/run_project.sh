#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <input_dir> <output_dir> <test_dir>"
    echo "Example ./run_with_inputs.sh /path/to/your/input /path/to/your/output /path/to/your/test"
    exit 1
fi

# Define the directories to mount from arguments
INPUT_DIR="$1"
OUTPUT_DIR="$2"
TEST_DIR="$3"

# Run the Docker container with the mounts
docker run --rm \
    -v "$INPUT_DIR:/app/input" \
    -v "$OUTPUT_DIR:/app/output" \
    -v "$TEST_DIR:/app/test" \
    python-docker-app
