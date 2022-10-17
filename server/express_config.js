const express = require("express");
const server = express();
// root path of this project
const rootPath = require("./root_path");
// cookie parser middleware to access request.cookies and response.cookie
server.use(require("cookie-parser")());
// load variables from .env
require("dotenv").config();

// check that all env variables are there
if (
    process.env.DEV &&
    process.env.PORT &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.APIKEY &&
    process.env.PGUSER &&
    process.env.PGHOST &&
    process.env.PGDATABASE &&
    process.env.PGPASSWORD &&
    process.env.PGPORT
) {
    console.log("All enviornment variables loaded, checking connection with database...");
} else {
    console.log(
        "Not all enviornment variables have been properly declared. Create a .env file and make sure its format " +
            "matches the one on the readme and it includes all of the necessary fields.  "
    );
    process.exit(1);
}

if (process.env.DEV === "true") {
    // use morgan logger if in development
    server.use(require("morgan")("dev"));
}
// connect to database once verified that all enviornment variables are there
const db = require("./db_pool");
// bootstrap files path
server.use("/bootstrap", express.static(`${rootPath}/node_modules/bootstrap`));
// static files routes
server.use(express.static(`${rootPath}/static`));
// use ejs for server side rendering
server.set("views", `${rootPath}/pages`);
server.set("view engine", "ejs");

// json middleware
server.use(express.urlencoded({extended: false}));
server.use(express.json());

module.exports = server;
