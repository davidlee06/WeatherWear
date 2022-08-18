const server = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");
const crypto = require("crypto");
const {getUser, googleClient} = require("./user_authentication");
const axios = require("axios")

// home page: if user is logged in, bring them to dashboard, otherwise, render the dashboard
server.get("/", (request, response) => {
    getUser(request, response, (user) => {
        // user does not exist, render home page
        if (user === false) {
            response.sendFile(`${rootPath}/pages/index.html`);
        }
        // user exists, go to dashboard
        else {
            response.redirect("/dashboard");
        }
    });
});
// dashboard page: if user is not logged in, bring them to home page
server.get("/locker", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is loggedd in, render dashboard
        else {
            response.render("locker", user);
        }
    });
});

server.get("/settings", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is loggedd in, render settings page
        else {
            response.render("settings", user);
        }
    });
});

server.get("/auth/me", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            response.send(user);
        }
    });
});

/*
Authentication routes
*/

/* google authentication callback route, google posts back here after it is logged in, maybe find a better way of 
doing it as every time the server is restarted the sessions are lost */
server.post("/auth/google/callback", (request, response) => {
    response.clearCookie("token");
    googleClient
        .verifyIdToken({
            idToken: request.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((user) => {
            user = user.getPayload();
            response.cookie("token", request.body.credential);
            db.query("select * from thetutor4u.user where id = $1;", [user.sub]).then((dbResponse) => {
                console.log(`made query for user ${user.name}`);
                // if user does not exist in the database, add a new entry for them
                if (dbResponse.rows.length === 0) {
                    console.log(
                        `new user ${user.name}, has been authenticated, but they are not found in database. ` +
                            `Inserting new user into database.`
                    );
                    db.query(
                        "insert into thetutor4u.user (id, email, username, first_name, last_name, " +
                            "time_account_created) values ($1, $2, $3, $4, $5, $6);",
                        [user.sub, user.email, crypto.randomUUID(), user.given_name, user.family_name, Date.now()]
                    ).then(() => {
                        console.log(`inserted new user ${user.name}`);
                        return;
                    });
                } else {
                    console.log(`found user ${user.name}`);
                }
                response.redirect("/dashboard");
            });
        });
});

server.post("/city", (request, response) => {
    let stringArray = request.body.cityName.split(", ");
    if (stringArray.length < 3) {
        response.statusCode = 404;
        response.send("invalid city type specified");
    }
    axios
        .get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${stringArray[0]},${stringArray[1]},${stringArray[2]}&` +
                `limit=1&appid=${process.env.APIKEY}`
        )
        .then((apiOne) => {
            apiOne.data[0];
            axios
                .get(
                    `http://api.openweathermap.org/data/2.5/forecast?lat=${apiOne.data[0].lat}&lon=` +
                        `${apiOne.data[0].lon}&appid=${process.env.APIKEY}`
                )
                .then((apiTwo) => {
                    apiTwo = apiTwo.data;
                    let newObject = {cityName: request.body.cityName, array: []};
                    for (let i = 0; i < apiTwo.list.length; ) {
                        let tempTemps = [];
                        let hoursPassed = 0;
                        let tempDateString = new Date(apiTwo.list[i].dt * 1000).toDateString();
                        hoursPassed = new Date(apiTwo.list[i].dt * 1000).getHours();
                        while (hoursPassed < 24 && i < apiTwo.list.length) {
                            tempTemps.push(apiTwo.list[i].main.temp);
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
                    response.render("city", newObject);
                });
        });
});

server.get("/auth/login");
server.get("/auth/signup");
module.exports = server;
