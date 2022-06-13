function flipUnits() {
    let tempHTML = document.getElementById("flipUnits");
    let flipButton = document.getElementById("flipButton");
    let units = tempHTML.innerHTML.substring(tempHTML.innerHTML.length - 1);
    let currentTemp = tempHTML.innerHTML.substring(
        0,
        tempHTML.innerHTML.length - 2
    );
    if (units === "C") {
        currentTemp = (currentTemp * 9) / 5 + 32;
        tempHTML.innerHTML = "" + parseInt(currentTemp) + "°F";
        flipButton.style = "background-color: red;";
        flipButton.innerHTML = "°F";
    } else {
        currentTemp = ((currentTemp - 32) * 5) / 9;
        tempHTML.innerHTML = "" + parseInt(currentTemp) + "°C";
        flipButton.style = "background-color: rebeccapurple;";
        flipButton.innerHTML = "°C";
    }
}
