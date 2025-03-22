## To make the project work you have to:

1. Install redis
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

2. Raise a redis server
 sudo systemctl start <redis-service-name> # redis or redis-server depending on platform

3. Go into the app folder
Run the script ./build_docker.sh

3. Then run 
``` #!/bin/bash
source venv/bin/activate
python3 run.py
```


# Extra
To test the simulation do:
``` #!/bin/bash
./app/run_docker.sh ./app/Simulations/7/inputs ./app/Simulations/7/outputs ./app/Simulations/7/tests 7
```