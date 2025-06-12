from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

from db import get_db  # fonction pour la base de donnée
from classement import Ranks
from random_pseudo_userid import get_userid, get_pseudo#crée un nouvel utilisateur

import uvicorn

from pydantic import BaseModel


app = FastAPI()


app.add_middleware(# CORS middleware configuration
    CORSMiddleware,
    allow_origins=["*"],  #autorises toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  #autorises toute les méthodes
    allow_headers=["*"],  #autorises tous les headers
)



@app.get("/questionnaire/utilisateur")  # vas chercher les utilisateurs (userid/pseudo/point) depuis la base donnée
def get_all_users(db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM utilisateur")
    user_data = cursor.fetchall()
    
    return {"user": user_data}

@app.get("/questionnaire/quiz")  # vas chercher les question et réponses de la base de donnée
def get_all_questions(db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM quiz")
    questions = cursor.fetchall()
    
    return {"questions": questions}



@app.get("/new_challenger")#vas chercher le nouvelle utilisateur avec de nouvelle userid et pseudo
def launch_New_User():
    newchallenger = get_userid(), get_pseudo()
    return{"newchallenger" : newchallenger}



class User(BaseModel):
    userid:int
    pseudo:str
    point:int
    rank:int

@app.post("/save_game_user")#recois la data de l'utilisateur
def save(user: User,db: mysql.connector.MySQLConnection = Depends(get_db)):
    
    userid = user.userid
    pseudo = user.pseudo
    point = user.point
    rank = user.rank
    
    mycursor = db.cursor()
    sql = ("INSERT INTO utilisateur (userid, pseudo, point, `rank`) VALUES(%s, %s, %s, %s)")
    val = (userid, pseudo, point, rank)
    mycursor.execute(sql,val)
    db.commit()
    
    Ranks()#class tout les joueurs à chaque fin de partie
    
    return {"message": "Data received", "user": user}


    
    
    
 
    
    
        
    
    


uvicorn.run(app, host="127.0.0.1", port=8000)