const city_name = document.getElementById("city_name");
const forecast_root = document.getElementById("forecast_root");
let weatherData = [];

// check to make sure that local storage has both lat and lon property before making any requests
if (
    localStorage.getItem("lat") === null ||
    localStorage.getItem("lon") === null ||
    localStorage.getItem("city_name") === null
) {
    localStorage.clear();
    alert(
        "Unable to load the latitude, longituide, and city specified. You will be returned to the homepage to re-enter " +
            "your info. Sorry"
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
                forecast_root.innerHTML += `<div>Date: ${new Date(weatherData[a].unix * 1000).toDateString()}, Low: ${
                    weatherData[a].low
                }, High: ${weatherData[a].high}</div>`;
            }
        });
    });
}
