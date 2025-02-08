import multiprocessing
import subprocess

if __name__ == "__main__":
    from app import create_app  # Import here to prevent multiple executions

    app = create_app()

    def run_celery_worker():
        """Start Celery worker with concurrency = CPU cores - 1"""
        cpu_count = max(1, multiprocessing.cpu_count() - 1)
        print(f"Starting Celery worker with concurrency={cpu_count}")

        subprocess.Popen([
            'celery', '-A', 'app.celery_instance.celery', 'worker',
            '--loglevel=info', f'--concurrency={cpu_count}'
        ])

    def run_application():
        """Start Flask application"""
        app.run(debug=True, use_reloader=False)

    # Start Celery worker
    run_celery_worker()

    # Start Flask app
    print("\n\n\nRunning API Service")
    run_application()

