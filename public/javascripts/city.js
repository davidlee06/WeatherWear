function redirect() {
    window.location.replace("outfit");
}
function goBack() {
    window.location.replace("/");
}
window.addEventListener("load", () => {
    // PARSE THE JSON STRING INTO OBJECT FIRST
    var data =
        '{"Day1":"High Low","Day2":"High Low","Day3":"High Low","Day4":"High Low","Day5":"High Low","Day6":"High Low","Day7":"High Low"}';
    data = JSON.parse(data);
    // console.table(data);

    // GENERATE TABLE
    // REATE EMPTY TABLE
    var table = document.createElement("table"),
        row,
        cellA,
        cellB;
    document.getElementById("pleaseGodIHope").appendChild(table);
    for (let key in data) {
        // ROWS & CELLS
        row = table.insertRow();
        cellA = row.insertCell();
        cellB = row.insertCell();

        // KEY & VALUE
        cellA.innerHTML = key;
        cellB.innerHTML = data[key];
    }
});
