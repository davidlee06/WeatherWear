const cookieParser = require("cookie-parser");
const express = require("express");
const server = express();
// root path of this project
const rootPath = require("./root_path");

// load variables from .env
require("dotenv").config();

// check that all env variables are there
if (
    process.env.DEV &&
    process.env.PORT &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
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

// bootstrap files path
server.use("/bootstrap", express.static(`${rootPath}/node_modules/bootstrap`));
// static files routes
server.use(express.static(`${rootPath}/static`));

// json middleware
server.use(express.urlencoded({extended: false}));
server.use(express.json());

// cookie parser
server.use(cookieParser());

module.exports = server;
