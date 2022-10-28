const city_name = document.getElementById("city_name");
const forecast_root = document.getElementById("forecast_root");
const image_root = document.getElementById("image_root");
const add_locker_button = document.getElementById("add_locker_button");
let weatherData = [];

var currentImageID;

// check to make sure that local storage has both lat and lon property before making any requests
if (
    localStorage.getItem("lat") === null ||
    localStorage.getItem("lon") === null ||
    localStorage.getItem("city_name") === null
) {
    localStorage.clear();
    alert(
        "Unable to load the latitude, longituide, and city specified. You will be returned to the homepage to " +
            "re-enter your info. Sorry"
    );
    window.location.href = "/";
} else {
    fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${localStorage.getItem("lat")}&lon=${localStorage.getItem(
            "lon"
        )}&appid=294e262744e0da66d38e517c095e60eb`
    ).then((fetchResponse) => {
        fetchResponse.json().then((data) => {
            // city wasn't provided by api because location was used, use the geocing from the openweathermap api
            if (localStorage.getItem("city_name") === "location") {
                document.title = `WeatherWear - ${data.city.name}`;
                city_name.innerHTML += `${data.city.name} (Approximate Location)`;
            } else {
                document.title = `WeatherWear - ${localStorage.getItem("city_name")}`;
                city_name.innerHTML += localStorage.getItem("city_name");
            }
            for (let a = 0; a < data.list.length; ) {
                let thisDayTemps = [];
                let thisDayUnix = data.list[a].dt;
                let hoursPassed = new Date(data.list[a].dt * 1000).getHours();
                while (hoursPassed < 24 && a < data.list.length) {
                    thisDayTemps.push(data.list[a++].main.temp);
                    hoursPassed += 3;
                }
                // sort array of temps for this day, first element will be lowest temp, last element will be highest temp
                thisDayTemps.sort((b, c) => {
                    if (b < c) {
                        return -1;
                    }
                    if (b > c) {
                        return 1;
                    }
                    return 0;
                });
                weatherData.push({
                    unix: thisDayUnix,
                    low: thisDayTemps[0],
                    high: thisDayTemps[thisDayTemps.length - 1]
                });
            }

            for (let a = 0; a < weatherData.length; ++a) {
                forecast_root.innerHTML += `<div class = "date_weather_div"><strong>Date: ${new Date(
                    weatherData[a].unix * 1000
                ).toDateString()}, Low: ${weatherData[a].low}, High: ${
                    weatherData[a].high
                }</div></strong><button class = "date_weather_rows btn btn-success">Click to generate outfit</button>`;
            }
            const date_rows = document.getElementsByClassName("date_weather_rows");
            for (let a = 0; a < date_rows.length; ++a) {
                date_rows[a].addEventListener("click", () => {
                    fetch("/api/new-image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({temp: (Number(weatherData[a].high) + Number(weatherData[a].low)) / 2})
                    }).then((fetchResponse) => {
                        fetchResponse.json().then(({image_id}) => {
                            add_locker_button.disabled = false;
                            currentImageID = image_id;
                            addLockerButtonListener(currentImageID);
                            // make button visible if not already visible and user is not signed in
                            if (add_locker_button.hasAttribute("style") === true && window.logged_in === true) {
                                add_locker_button.removeAttribute("style");
                                add_visible = true;
                            }
                            image_root.innerHTML = `<img src="/api/get-image?image_id=${image_id}" />`;
                        });
                    });
                });
            }
        });
    });
    const custom_temp = document.getElementById("custom_temp");
    const custom_button = document.getElementById("custom_button");
    custom_button.addEventListener("click", () => {
        fetch("/api/new-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({temp: Number(custom_temp.value)})
        }).then((fetchResponse) => {
            fetchResponse.json().then(({image_id}) => {
                image_root.innerHTML = `<img src="/api/get-image?image_id=${image_id}" />`;
            });
        });
    });
}
function convertUnits(temp, unit) {
    if (unit === "C") {
        return `${Math.round(temp - 273.15)}°C`;
    } else if (unit === "F") {
        return `${Math.round(1.8 * (temp - 273) + 32)}°F`;
    } else {
        return `${temp}°K`;
    }
}

function updateUnits(unit) {
    const date_rows = document.getElementsByClassName("date_weather_div");
    for (let a = 0; a < date_rows.length; ++a) {
        date_rows[a].innerHTML = `Date: ${new Date(weatherData[a].unix * 1000).toDateString()}, Low: ${convertUnits(
            weatherData[a].low,
            unit
        )}, High: ${convertUnits(weatherData[a].high, unit)}</div>`;
    }
}

document.getElementById("cel_button").addEventListener("click", () => {
    updateUnits("C");
});

document.getElementById("far_button").addEventListener("click", () => {
    updateUnits("F");
});

document.getElementById("kel_button").addEventListener("click", () => {
    updateUnits("K");
});

function addLockerButtonListener(currentImageID) {
    if (window.logged_in === true) {
        document.getElementById("signed_in_root").removeAttribute("style");
        add_locker_button.addEventListener("click", () => {
            fetch("/api/add-locker-outfit", {
                credentials: "same-origin",
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({image_id: currentImageID})
            }).then((fetchResponse) => {
                add_locker_button.disabled = true;
            });
        });
    }
}
