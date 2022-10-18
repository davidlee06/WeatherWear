/*
Every second, take input from textbox and look up cities in the weather api from there
*/
const city_search = document.getElementById("city_search");
const city_list_root = document.getElementById("city_list_root");
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

setInterval(() => {
    if (string() !== oldString) {
        fetch(`https://api.weatherapi.com/v1/search.json?key=55daed32ec294eababf141438220204&q=${string()}`).then(
            (fetchResponse) => {
                fetchResponse.json().then((array) => {
                    city_list_root.innerHTML = "";
                    for (let a = 0; a < array.length; ++a) {
                        city_list_root.innerHTML +=
                            `<button class = "city_buttons" lat = "${array[a]["lat"]}" lon ` +
                            `= "${array[a]["lon"]}">${array[a]["name"]}, ${array[a]["region"]}, ` +
                            `${array[a]["country"]}</button>`;
                    }
                    const buttons = document.getElementsByClassName("city_buttons");
                    for (let a = 0; a < buttons.length; ++a) {
                        buttons[a].addEventListener("click", () => {
                            submitInfo(array[a]["lat"], array[a]["lon"], buttons[a].innerHTML);
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
        submitInfo(latData, lonData, "My Location");
    });
});
