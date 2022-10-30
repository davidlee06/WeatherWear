// check that all env variables are there
require("dotenv").config();
if (
    process.env.PORT &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.DB_CONNECTION_STRING
) {
    console.log("All enviornment variables loaded, checking connection with database...");
} else {
    console.log(
        "Not all enviornment variables have been properly declared. Create a .env file and make sure its format " +
            "matches the one on the readme and it includes all of the necessary fields.  "
    );
    process.exit(1);
}

const server = require("./express_page_routes");
const db = require("./db_connect");
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
    .catch((error) => {
        console.log("Unable to start server: unable to establish connection with the database. Exiting...");
        console.log(error);
        process.exit(1);
    });
