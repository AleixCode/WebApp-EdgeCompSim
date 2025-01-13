from app import create_celery_app
import requests


celery = create_celery_app()


@celery.task
def run_simulation(iterations, precision, callback_url):
    # Simulate long task
    from time import sleep
    sleep(10)

    result = f"Simulated {iterations} iterations with {precision} precision."

    # Send result to the callback URL (webhook)
    if callback_url:
        try:
            requests.post(callback_url, json={"status": "completed", "result": result})
        except requests.RequestException as e:
            return {"status": "failed to send callback", "error": str(e)}

    return result