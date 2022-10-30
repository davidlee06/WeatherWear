const cookieParser = require("cookie-parser");
const express = require("express");
const root_path = require("./root_path");
const server = express();
// root path of this project
const rootPath = require("./root_path");

// load variables from .env

// bootstrap files path
server.use("/bootstrap", express.static(`${root_path}/node_modules/bootstrap`));
// static files routes
server.use(express.static(`${rootPath}/static`));

// json middleware
server.use(express.urlencoded({extended: false}));
server.use(express.json());

// cookie parser
server.use(cookieParser());

module.exports = server;
