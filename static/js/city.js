const city_name = document.getElementById("city_name");
const forecast_root = document.getElementById("forecast_root");

// check to make sure that local storage has both lat and lon property before making any requests
if (localStorage.getItem("lat") === null || localStorage.getItem("lon") === null) {
    localStorage.clear();
    alert(
        "Unable to load the latitude and longituide specified. You will be returned to the homepage to re-enter " +
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
            /* 
            TODO continue from here, check weatherData.json to see what this object looks like
            code here on line 111 processes this data https://github.com/davidlee06/WeatherWear/blob/june-endyear-final/app.js
            we have to use that geocoding api because it gives you multiple different results from your text and works 
            globally, openweathermap one does not
            we have to use this weather api because it works globally and gives you a forecast for the most amount of
             time, the other website only forecasts for 3 days, this one does 5
            */
        });
    });
}
