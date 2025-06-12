from db import get_db

def Ranks():
    cnx = get_db()  # Connexion à la base de données
    mycursor = cnx.cursor()

    sql = "SELECT userid, pseudo, point FROM utilisateur"  # Requête SQL pour récupérer les utilisateurs et leurs points
    mycursor.execute(sql)
    utilisateurs = mycursor.fetchall()
    print(f"Utilisateurs fetches {utilisateurs}")

    # Trier les utilisateurs par points décroissants
    utilisateurs_tries = sorted(utilisateurs, key=lambda x: x[2], reverse=True)
    print(f"Utilisateurs triés {utilisateurs_tries}")

    for rank, utilisateur in enumerate(utilisateurs_tries, start=1):# Attribuer un rang à chaque utilisateur
        userid = utilisateur[0]  # Récupérer l'ID utilisateur correct

        # Mettre à jour le rang de l'utilisateur dans la base de données
        sql = "UPDATE utilisateur SET `rank` = %s WHERE userid = %s"
        val = (rank, userid)
        mycursor.execute(sql, val)
        
    cnx.commit()  # Valider les modifications
    cnx.close()  # Fermeture de la connexion



# Appeler la fonction pour mettre à jour les rangs des utilisateurs

