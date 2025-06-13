import mysql.connector
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_db():
    cnx = mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database="questionnaire"
    )
    return cnx

@contextmanager
def start_db():
    cnx = get_db()
    try:
        print("Db starting")
        yield cnx
    finally:
        cnx.close()
