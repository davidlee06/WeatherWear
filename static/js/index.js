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

let ul = document.getElementById("dropdown-menu");
ul.hidden = true;

setInterval(() => {
    if (string() === "") {
        ul.hidden = true;
    }
    if (string() !== oldString) {
        ul.innerHTML = "";
        fetch(`https://api.weatherapi.com/v1/search.json?key=55daed32ec294eababf141438220204&q=${string()}`).then(
            (fetchResponse) => {
                fetchResponse.json().then((array) => {
                    for (let a = 0; a < array.length; ++a) {
                        ul.hidden = false;
                        let li = document.createElement("li");
                        let anchor = document.createElement("a");
                        anchor.textContent = array[a]["name"];
                        anchor.setAttribute("href", `#${array[a]["name"]}`);
                        anchor.setAttribute("class", "dropdown-item");
                        li.appendChild(anchor);
                        ul.appendChild(li);
                        anchor.addEventListener("click", () => {
                            submitInfo(array[a]["lat"], array[a]["lon"], array[a]["name"]);
                        });
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

if (window.logged_in) {
    const saved_cities_root = document.getElementById("saved_cities_root");
    fetch("/api/get-saved-cities", {credentials: "same-origin"}).then((fetchResponse) => {
        fetchResponse.json().then((saved_cities) => {
            for (let a = 0; a < saved_cities.length; ++a) {
                const button = document.createElement("button");
                button.setAttribute("class", "btn btn-primary saved_city_button");
                button.innerHTML = saved_cities[a]["city_name"];
                button.addEventListener("click", () => {
                    submitInfo(saved_cities[a]["lat"], saved_cities[a]["lon"], saved_cities[a]["city_name"]);
                });
                saved_cities_root.appendChild(button);
            }
        });
    });
    const clear_cities = document.getElementById("clear_cities");
    clear_cities.addEventListener("click", () => {
        fetch("/api/clear-saved-cities", {credentials: "same-origin"}).then(() => {
            saved_cities_root.innerHTML = "";
            clear_cities.setAttribute("disabled", "true");
        });
    });
}
