
function sortTable(tableId, n) {//prends l'id et la colone de la table concerné
  var table, rows, switching, i, x, y, shouldSwitch, direction, switchcount = 0;
  var id = document.getElementsByTagName("span");
  table = document.getElementById(tableId);
  switching = true;
  direction = "asc"; // paramètre le filtre en ascendant

  var headers = table.getElementsByTagName("th");//enlève l'ancienne flèche si un filtre à déja étais appliquer
  for (var j = 0; j < headers.length; j++) {
    headers[j].getElementsByClassName("arrow")[0].classList.remove("asc", "desc");
  }

  while (switching) { // boucle à l'infini tant qu'aucun filtre n'a été fait
    switching = false; // lance la boucle à false
    rows = table.rows;


    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false; // Get the two elements you want to compare, one from current row and one from the next:
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];

      let xContent = x.innerHTML.toLowerCase();
      let yContent = y.innerHTML.toLowerCase();

      if(!isNaN(xContent) && !isNaN(yContent)){// convertit la colone en type float si ce sont des nombres
        xContent = parseFloat(xContent);
        yContent = parseFloat(yContent);
      }

      // vérifie si les caractéres doivent changer de place selon le mode ascendant ou descendant
      if (direction == "asc") {
        
        if (xContent > yContent) {// on change l'ordre si x est plus grand que y
          
          shouldSwitch = true;
          break;
        }
      } else if (direction == "desc") {
        if (xContent < yContent) {// on change l'ordre si y est plus grand que x
          
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;

    } else {
      if (switchcount == 0 && direction == "asc") {
        direction = "desc";
        switching = true;
        
      }
    }
    headers[n].getElementsByClassName("arrow")[0].classList.add(direction);
  }

}

