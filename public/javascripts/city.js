function redirect() {
    window.location.replace("outfit");
}
function goBack() {
    window.location.replace("/");
}

function flipUnits() {
    // if the units are C flip everything to F
    let tableRows = document.getElementsByClassName("tableRow");
    let tableCols = [];
    for (let i = 0; i < tableRows.length; i++) {
        for (let j = 1; j <= 2; j++) {
            tableCols.push(tableRows[i].cells[j]);
        }
    }

    if (document.getElementById("tempUnits").innerHTML.includes("C")) {
        for (let i = 0; i < tableCols.length; ++i) {
            let tempTemp = parseInt(
                tableCols[i].innerHTML.substring(
                    0,
                    tableCols[i].innerHTML.length - 2
                )
            );
            tableCols[i].innerHTML = parseInt((tempTemp * 9) / 5 + 32) + "°F";
        }
        document.getElementById("tempUnits").innerHTML = "°F";
        document.getElementById("tempUnits").style = "background-color: red;";
    }
    // otherwise, flip everything to C
    else {
        for (let i = 0; i < tableCols.length; ++i) {
            let tempTemp = parseInt(
                tableCols[i].innerHTML.substring(
                    0,
                    tableCols[i].innerHTML.length - 2
                )
            );
            tableCols[i].innerHTML = parseInt(((tempTemp - 32) * 5) / 9) + "°C";
        }
        document.getElementById("tempUnits").innerHTML = "°C";
        document.getElementById("tempUnits").style =
            "background-color: rebeccapurple;";
    }
}
