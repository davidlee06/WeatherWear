const express = require("express");
const app = express();
const port = 8080;
const logger = require("morgan");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();
const apiKey = process.env.apiKey;

// get morgan logger to write to console
app.use(logger("dev"));

// public folder will have all javascripts htmls and css that our page will render
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/html");
app.set("view engine", "ejs");

// make express work with post requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/city", (req, res) => {
    let stringArray = req.body.cityName.split(", ");
    if (stringArray.length < 3) {
        res.statusCode = 404;
        res.send("invalid city type specified");
    }
    // get lat and long coords from city name
    let lat;
    let lon;
    fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${stringArray[0]},${stringArray[1]},${stringArray[2]}&limit=1&appid=${apiKey}`
    )
        .then((geoLocationApiResponse) => geoLocationApiResponse.json())
        .then((geoLocationApiResponseJson) => {
            lat = geoLocationApiResponseJson[0].lat;
            lon = geoLocationApiResponseJson[0].lon;
        });
    // get weather data from lat and long coords
    let weatherData;
    fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
        .then((weatherApiResponse) => weatherApiResponse.json())
        .then((weatherApiResponseJson) => {
            weatherData = weatherApiResponseJson;
        });
    console.log(weatherData);
});

app.get("/outfit", (req, res) => {
    res.render("outfit");
});

// start server and have it listen to the part
app.listen(port, () => {
    console.log(
        `App server listening on ${port}. URL: http://localhost:${port})`
    );
});
