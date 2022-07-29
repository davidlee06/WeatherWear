import {requiresAuth} from "express-openid-connect";
// load database pool object to run queries
import server from "./ExpressConfig";
import express from "express";
import axios from "axios";
import databasePool from "./DatabasePool";

/* 
route for when the city name is submitted. Find the city's coordinates, then lookup the weather for those 
coordinates, then render the page with those coordinates 
*/
server.post("/weather", (request: express.Request, response: express.Response) => {
    // check to make sure that object has two fields, city and state, and that state is formatted correctly
    if (!("city" in request.body && "state" in request.body && request.body["state"].length === 2)) {
        response.statusCode = 400;
        response.send(
            "An incorrect object has been sent. Make sure you send an object containing a city key, and a state key," +
                `with the state key being length 2. The object you sent was ${JSON.stringify(request.body)}`
        );
        return;
    }
    // make request to turn location name into location coordinates
    axios
        .get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${request.body.city},${request.body.state},US&limit` +
                `=1&appid=${process.env.APIKEY}`
        )
        .then((responseOne) => {
            responseOne.data[0];
            // make request to get weather data from location coordinates
            axios
                .get(
                    `http://api.openweathermap.org/data/2.5/forecast?lat=${responseOne.data[0].lat}&lon=` +
                        `${responseOne.data[0].lon}&appid=${process.env.APIKEY}`
                )
                .then((responseTwo) => {
                    // create new object that we'll use to server side render the html
                    let newObject: {cityName: string; array: any[]} = {
                        cityName: `${request.body.city}, ${request.body.state}`,
                        array: []
                    };
                    for (let i = 0; i < responseTwo.data.list.length; ) {
                        let tempTemps = [];
                        let hoursPassed = 0;
                        let tempDateString = new Date(responseTwo.data.list[i].dt * 1000).toDateString();
                        hoursPassed = new Date(responseTwo.data.list[i].dt * 1000).getHours();
                        while (hoursPassed < 24 && i < responseTwo.data.list.length) {
                            tempTemps.push(responseTwo.data.list[i].main.temp);
                            ++i;
                            hoursPassed += 3;
                        }
                        // sort array, first one will be the smallest temp, other one will be the largest temp
                        tempTemps.sort((a, b) => {
                            if (a < b) {
                                return -1;
                            }
                            if (a > b) {
                                return 1;
                            }
                            return 0;
                        });
                        newObject.array.push([tempDateString, tempTemps[0], tempTemps[tempTemps.length - 1]]);
                    }
                    response.render("weather", newObject);
                });
        });
});

// interface indexReponsse {
//     imageURL: string;
// }

server.get("/", (request: express.Request, response: express.Response) => {
    checkUser(request.oidc.user);
    if (request.oidc.isAuthenticated()) {
        response.render("index", {
            buttonText: `Welcome ${request.oidc.user["name"]}, view your locker.`,
            signedIn: true
        });
    }
    response.render("index", {buttonText: "Sign in/Sign up", signedIn: false});
});

server.get("/locker", requiresAuth(), (request: express.Request, response: express.Response) => {
    // go back to home page if user isn't logged in
    if (!request.oidc.isAuthenticated()) {
        response.redirect("/");
    }
});

server.get("/profile", requiresAuth(), (request: express.Request, response: express.Response) => {
    response.send(JSON.stringify(request.oidc.user));
});

server.post("/callback", (req, res) => {
    console.log(req.body);
    res.send("Ok");
});

// TODO continue from here add the database stuff
function checkUser(user): void {
    console.log(`select * from weatherwear.user where weatherwear.user.id = ${user.sub};`)
    databasePool.query(`select * from weatherwear.user where weatherwear.user.id = ${user.sub};`).then((response) => {
        console.log(response);
    });
}
