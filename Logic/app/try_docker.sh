#!/bin/bash

docker run -d --rm \
    --name "MONGO_Test" \
    --network app_network \
    -p "27017:27017" \
    mongo:5.0

docker run --rm \
    --name "python-app" \
    --network app_network \
    -e MONGO_URI="mongodb://MONGO_Test:27017" \
    -v "/home/arch/Work/WebApp-EdgeCompSim/Logic/app/Simulations/1/inputs:/app/inputs" \
    -v "/home/arch/Work/WebApp-EdgeCompSim/Logic/app/Simulations/1/outputs:/app/outputs" \
    -v "/home/arch/Work/WebApp-EdgeCompSim/Logic/app/Simulations/1/tests:/app/tests" \
    python-docker-app