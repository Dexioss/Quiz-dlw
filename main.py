from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

from db import get_db#function to connect to the database
from classement import Ranks
from random_pseudo_userid import get_userid, get_pseudo#function to create a new user

import uvicorn
from pydantic import BaseModel


app = FastAPI()


app.add_middleware(# CORS middleware configuration
    CORSMiddleware,
    allow_origins=["*"],  #allow all the origines
    allow_credentials=True,
    allow_methods=["*"],  #allow all the methodes
    allow_headers=["*"],  #allow all the headers
)



@app.get("/questionnaire/utilisateur")  # get the users (userid/pseudo/point) from the database
def get_all_users(db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM utilisateur")
    user_data = cursor.fetchall()
    
    return {"user": user_data}

@app.get("/questionnaire/quiz")  # get the question and their answer from the database
def get_all_questions(db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM quiz")
    questions = cursor.fetchall()
    
    return {"questions": questions}



@app.get("/new_challenger")#the API give the client a new random user
def launch_New_User():
    newchallenger = get_userid(), get_pseudo()
    return{"newchallenger" : newchallenger}



class User(BaseModel):
    userid:int
    pseudo:str
    point:int
    rank:int

@app.post("/save_game_user")#receive the point and users of the last game
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
    
    Ranks()#reranks every users of the database 
    
    return {"message": "Data received", "user": user}
    
    


uvicorn.run(app, host="127.0.0.1", port=8000)#launch the API