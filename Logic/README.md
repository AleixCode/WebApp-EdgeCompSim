## To make the project work you have to:

1. Raise a redis server 
2. Run the command 
``` #!/bin/bash
celery -A app.celery_instance.celery worker --loglevel=info
```
3. Then run 
``` #!/bin/bash
source venv/bin/activate
python3 run.py
```