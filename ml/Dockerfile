FROM python:3.11.6-bookworm

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

#EXPOSE 3002

EXPOSE 50051

CMD ["python", "-u", "./src/app.py"]
