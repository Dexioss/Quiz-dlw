function search(inputId, tableId) {
    // Récupérer les éléments
    var input = document.getElementById(inputId);
    var filter = input.value.toUpperCase();
    var table = document.getElementById(tableId);
    var tr = table.getElementsByTagName("tr");

    // Boucle à travers toutes les lignes de la table
    for (var i = 1; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td");
        var match = false;

        // Boucle à travers toutes les cellules de la ligne
        for (var j = 0; j < td.length; j++) {
            if (td[j]) {
                if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    match = true;
                    break;
                }
            }
        }

        // Afficher ou masquer la ligne en fonction de la correspondance
        if (match) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}