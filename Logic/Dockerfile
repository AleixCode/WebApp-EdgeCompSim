# Use a base image with Python installed
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the project code into the container
COPY ../GEN_EUA_TS .

# Install dependencies
RUN pip install -r requirements.txt

# Default command to run the script
CMD ["python", "main.py"]
