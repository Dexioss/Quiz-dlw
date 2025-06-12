import mysql.connector
from contextlib import contextmanager


def get_db():
    cnx = mysql.connector.connect(#connection au serveur et à la base de donnée précise
        host="127.0.0.1",
        port=3306,
        user="root",
        password="",
        database="questionnaire"
    )
    return cnx

@contextmanager
def start_db():
    cnx = get_db()
    try:
        print("Db startingf")
        yield cnx
    finally:
        cnx.close()
        