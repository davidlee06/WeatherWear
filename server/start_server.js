const server = require("./express_routes");
const db = require("./db_pool");
const axios = require("axios");

function error() {
    console.log("Issue with Weather API, unable to start server.");
    process.exit(1);
}

// test database connection, stop the process if you cannot connect to the database
db.query("select 1 * 1;")
    .then(() => {
        console.log("Established connection with the database. Checking that weather api is online...");
        axios
            .get("https://api.weather.gov")
            .then(({status}) => {
                if (status === 200) {
                    console.log("Coordinate weather api online, checking if Geocoding weather api is online...");
                    axios
                        .get("https://api.weatherapi.com/")
                        .then(({status}) => {
                            if (status === 200) {
                                console.log("Geocoding api online, starting server...");
                                server.listen(process.env.PORT, () => {
                                    console.log(
                                        `Server sucessfully launched on port ${process.env.PORT}. Go to ` +
                                            `http://localhost:${process.env.PORT}`
                                    );
                                });
                            } else {
                                error();
                            }
                        })
                        .catch(error);
                } else {
                    error();
                }
            })
            .catch(error);
    })
    .catch(() => {
        console.log("Unable to start server: unable to establish connection with the database. Exiting...");
        process.exit(1);
    });
