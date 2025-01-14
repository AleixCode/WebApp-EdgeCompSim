from app import create_app
import subprocess
import sys

app, celery = create_app()

def run_celery_worker(worker_count):
    for _ in range(worker_count):
        subprocess.Popen(['celery', '-A', 'app.celery', 'worker', '--loglevel=info'])

def run_application():
    app.run(debug=True)


if __name__ == "__main__":
    # Ask the user how many workers they want to run
    worker_count = int(input("Enter the number of Celery workers to start: "))

    # Start the requested number of Celery workers
    run_celery_worker(worker_count)

    # Run the Flask application
    run_application()
