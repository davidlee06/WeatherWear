import morgan from "morgan";
import axios from "axios";
import fs from "fs";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

// if debug is set to true, use morgan in dev mode
if (process.env.DEBUG) {
    // get morgan logger to write to console
    app.use(morgan("dev"));
}
// server bootstrap files from our local node_modules instead of cdn
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap`));

// set up routes for statuc files
app.use(express.static(__dirname + "/static"));
// set up server side rendering with ejs
app.set("views", __dirname + "/ssr");
app.set("view engine", "ejs");

// make express work with json
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// if ./static/images/generatedOutfits exists, delete all the files in it
// otherwise, make the directory
if (fs.existsSync("./static/images/generatedOutfits")) {
    console.log("clearing generatedOutfits directory...");
    const files = fs.readdirSync("static/images/generatedOutfits");
    for (let file in files) {
        fs.unlinkSync(`static/images/generatedOutfits/${files[file]}`);
    }
    console.log("cleared generatedOutfits directory.");
} else {
    fs.mkdirSync("./static/images/generatedOutfits");
}

