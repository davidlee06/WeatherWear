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
    for (let i = 0; i < tableRows; ++i) {
        for (let j = 0; j < tableRows.cells.length; ++j) {
            tableCols.push(tableRows.cells[j])
        }
    }

    if (document.getElementById("tempUnits").innerHTML.substring(1) === "C") {
        for (let i = 0; i < tableCols.length; ++i) {
            let tempTemp = parseInt(tableCols[i].innerHTML.substring(0, tableCols[i].innerHTML.length - 2));
            tableCols[i].innerHTML = parseInt(tempTemp * 9)
        }
    }
    // otherwise, flip everything to C
    else {
    }
}
