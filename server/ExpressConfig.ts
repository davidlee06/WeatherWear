import {auth} from "express-openid-connect";
import morgan from "morgan";
import express from "express";
const server: express.Application = express();
import path from "path";
const rootPath: string = path.resolve(__dirname, "..");

// if debug is set to true, use morgan in dev mode
if (process.env.DEBUG) {
    // get morgan logger to write to console
    server.use(morgan("dev"));
}
// server bootstrap files from our local node_modules instead of cdn
server.use("/bootstrap", express.static(`${rootPath}/node_modules/bootstrap`));

// set up routes for static files
server.use(express.static(`${rootPath}/static`));
// set up server side rendering with ejs
server.set("views", `${rootPath}/ssr`);
server.set("view engine", "ejs");

// make express work with json
server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        secret: process.env.SECRET,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        issuerBaseURL: process.env.ISSUER_BASE_URL
    })
);

export default server;
