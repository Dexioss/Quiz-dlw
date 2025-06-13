from db import get_db

def Ranks():
    cnx = get_db()  # Connect to the database
    mycursor = cnx.cursor()

    sql = "SELECT userid, pseudo, point FROM utilisateur"  # SQL request to get userid, pseudo, point from database
    mycursor.execute(sql)
    utilisateurs = mycursor.fetchall()
    print(f"Utilisateurs fetches {utilisateurs}")

    #sort the users by descending point
    utilisateurs_tries = sorted(utilisateurs, key=lambda x: x[2], reverse=True)
    print(f"Utilisateurs triés {utilisateurs_tries}")
    
    for rank, utilisateur in enumerate(utilisateurs_tries, start=1):# give ranks from 1 until the last users
        userid = utilisateur[0]

        #update the rank users from the database
        sql = "UPDATE utilisateur SET `rank` = %s WHERE userid = %s"
        val = (rank, userid)
        mycursor.execute(sql, val)
        
    cnx.commit()  # save changes
    cnx.close()  # close connection to the database


