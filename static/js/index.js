/*
Every second, take input from textbox and look up cities in the weather api from there
*/
const city_search = document.getElementById("city_search");
let oldString = string();

function string() {
    return city_search.value;
}

/*
submits the form with the lat and lon values provided
*/
function submitInfo(latData, lonData, cityName) {
    localStorage.setItem("lat", latData);
    localStorage.setItem("lon", lonData);
    localStorage.setItem("city_name", cityName);
    window.location.href = "/city";
}

var ul = document.getElementById("dropdown-menu");
ul.hidden = true;

setInterval(() => {
    if (string()===""){
        ul.hidden = true;
    }
    if (string() !== oldString) {
        ul.innerHTML = ""
        fetch(`https://api.weatherapi.com/v1/search.json?key=55daed32ec294eababf141438220204&q=${string()}`).then(
            (fetchResponse) => {
                fetchResponse.json().then((array) => {
                    for (let a = 0; a < array.length; ++a) {
                        ul.hidden = false;
                        var li = document.createElement("li");
                        var anchor = document.createElement('a')
                        anchor.textContent = array[a]["name"]
                        anchor.setAttribute('href', `#${array[a]["name"]}`);
                        anchor.setAttribute("class", "dropdown-item");
                        li.appendChild(anchor);
                        ul.appendChild(li);
                        anchor.addEventListener('click', ()=>{submitInfo(array[a]["lat"], array[a]["lon"], array[a]["name"])});
                    }
                });
            }
        );
    }
    oldString = string();
}, 1000);

document.getElementById("use_location_button").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        let latData = position.coords.latitude;
        let lonData = position.coords.longitude;
        submitInfo(latData, lonData, "location");
    });
});
