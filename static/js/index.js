/*
Every second, take input from textbook and look up cities in the weather api from there
*/

const city_search = document.getElementById("city_search");
const city_list_root = document.getElementById("city_list_root");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");
const form = document.getElementById("form");
function string() {
    return city_search.value;
}

let oldString = string();

setInterval(() => {
    if (string() !== oldString) {
        fetch(`https://api.weatherapi.com/v1/search.json?key=55daed32ec294eababf141438220204&q=${string()}`).then(
            (fetchResponse) => {
                fetchResponse.json().then((array) => {
                    city_list_root.innerHTML = "";
                    for (let a = 0; a < array.length; ++a) {
                        city_list_root.innerHTML += `<button class = "city_buttons" lat = "${array[a]["lat"]}" lon = "${array[a]["lon"]}">${array[a]["name"]}, ${array[a]["region"]}, ${array[a]["country"]}</button>`;
                    }
                    const buttons = document.getElementsByClassName("city_buttons");
                    for (let a = 0; a < buttons.length; ++a) {
                        buttons[a].addEventListener("click", () => {
                            lat.setAttribute("value", array[a]["lat"]);
                            lon.setAttribute("value", array[a]["lon"]);
                            form.submit();
                        });
                    }
                });
            }
        );
    }
    oldString = string();
}, 1000);
