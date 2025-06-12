async function showQuiz() {
    let myurl = "http://127.0.0.1:8000/questionnaire/quiz";//cherche question et réponse de la base de donnée

    try {
        let response = await fetch(myurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        let db = await response.json();
        return db;
    } catch (error) {
        console.error(error);
    }
}

async function loadQuestions() {//affiche les questions de la base de donnée
    let data = await showQuiz();

    if(data){
        let quizQuestions = [...data.questions];
        
        for (let i = 0; i< quizQuestions.length; i++) {
            let question = quizQuestions[i][0];
            

            let quizQuestionContainer = document.getElementById(`question${i}`);
            quizQuestionContainer.innerHTML += question;
        }
    }
}



async function userCorrection() {//correction
    let data = await showQuiz();
    console.log(`The quiz response : ${data}`);

    if(data){
        let quizReponses = [...data.questions];

        for (let i = 0; i< quizReponses.length; i++) {
            let reponse = quizReponses[i][1];
            let quizCorrectionContainer = document.getElementById(`correction${i}`);
            quizCorrectionContainer.innerHTML += ("la Bonne réponse étais : " + reponse);
            
        }
    }
}


async function setpoint() {//affiche les points
    let data = await showQuiz();
    
    if(data){
        let quizReponses = [...data.questions];
        let point = 0;
        let useranswer = [];

        for (let i = 0; i< quizReponses.length; i++) {

            let answer = document.querySelector(`input[name="question${i}"]:checked`);

            if(answer){
                useranswer.push(answer.value);
            }

            if(useranswer[i] == quizReponses[i][1]){
                point++;

                
            }
            
            if(i == 19){
                let afficherpoint = document.getElementById("pointgagner");
                afficherpoint.innerHTML = `Bravo vous avez gagner : ${point}`;
                console.log("ou sont passé les points",point)
                return point;
            }
            
        }
    }
}

async function newUsers() {// vas chercher un userid et pseudo pour la partie en court
    let myurl = "http://127.0.0.1:8000/new_challenger";

    try {
        let response = await fetch(myurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        let data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


async function afficherNewUser() {//informe l'utilisateur de son userid et pseudo
    let data = await newUsers();

    if (data) {
        let newuser = [...data.newchallenger];
        let showchallenger = document.getElementById("showChallenger");
        showchallenger.innerHTML = `Attention challenger, retenez bien votre userid : ${newuser[0]}, et pseudo : ${newuser[1]} pour vous vantez dans toute l'entreprise ou vous terrez dans l'ombre.<br>
                                    nuh hu hu vous pouvez pas rappuyer sur les boutons`;
        return newuser
    }
}

async function showRanking() {//le classement
    let myurl = "http://127.0.0.1:8000/questionnaire/utilisateur";//rank

    try {
        const response = await fetch(myurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
    }
}
async function rankClasser() {
    document.addEventListener("DOMContentLoaded", async () => {
    const rankings = await showRanking();
    
    if (rankings && rankings.user && rankings.user.length > 0) {
        const rankingTable = document.getElementById("ranking");

        let users = [...rankings.user];

        users.sort((userA, userB) => {
            
            return userB[2] - userA[2];// Trier par points décroissants (plus de points = premier)
            
        });


        
        
        for (let i = 0; i < users.length; i++) {// Étape 3: Créer les lignes du tableau
            let user = users[i]; // L'utilisateur actuel
            
            // Récupérer les données de cet utilisateur
            let userid = user[0];     // Index 0 = userid
            let pseudo = user[1];     // Index 1 = nom/pseudo
            let points = user[2];     // Index 2 = points
            let rang = user[3];       // Index 3 = rang
            let nouvelleLigne = document.createElement("tr");
            let celluleUserid = document.createElement("td");
            celluleUserid.textContent = userid;
            let cellulePseudo = document.createElement("td");
            cellulePseudo.textContent = pseudo;
            let cellulePoints = document.createElement("td");
            cellulePoints.textContent = points;
            let celluleRang = document.createElement("td");
            celluleRang.textContent = rang; 
            nouvelleLigne.appendChild(celluleUserid);
            nouvelleLigne.appendChild(cellulePseudo);
            nouvelleLigne.appendChild(cellulePoints);
            nouvelleLigne.appendChild(celluleRang);
            rankingTable.appendChild(nouvelleLigne);
        }
    } else {
        console.error("Les données du classement ne sont pas dans le bon format");
    }
});    
}



async function getUserPoint() {//vas chercher les donnée userid, pseudo et point de la partie terminer
    try {
        let challenger = await afficherNewUser();
        let point = await setpoint();
        rank = 1001;
        
        if (challenger) {
            let newuser = {
                userid: challenger[0],
                pseudo: challenger[1],
                point: point,
                rank: rank};

            console.log("tout marche en fait : ", newuser);
            return newuser;
        } else {
            console.error("Failed to fetch challenger");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user point: ", error);
        return null;
    }
}

const sendPostRequest = async (loaduser) => {// fonction qui envoie les données en post

    let myurl = "http://127.0.0.1:8000/save_game_user";

    try {
        let response = await fetch(myurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loaduser)
        });

        let data = await response.json();

        console.log(data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


async function sauvegarde(){// actionne les fonctions
    
    let newuser = await getUserPoint();
    if (newuser) {
        let responseFromApi = await sendPostRequest(newuser);
        console.log("Response from API:", responseFromApi);
    }
}

