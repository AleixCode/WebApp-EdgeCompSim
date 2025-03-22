#!/bin/bash
sudo docker build -t my-mongodb .
docker run -d -p 27016:27017 --name mongodb_container my-mongodb

