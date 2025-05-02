FROM python:3.11.3

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r  requirements.txt

RUN mkdir /app
COPY proptrans.pkl /app
COPY model.pkl /app
COPY api.py /app
COPY utils.py /app
WORKDIR /app

EXPOSE 8080
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]