FROM python:3.13-slim
WORKDIR /app
COPY GEN_EUA_TS .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# Default command to run the script
CMD ["python", "test_manager.py"]
