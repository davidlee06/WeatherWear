import morgan from "morgan";
import fs from "fs";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import path from "path";
const rootPath: string = path.resolve(__dirname, "..");
// if debug is set to true, use morgan in dev mode
if (process.env.DEBUG) {
    // get morgan logger to write to console
    app.use(morgan("dev"));
}
// server bootstrap files from our local node_modules instead of cdn
app.use("/bootstrap", express.static(`${rootPath}/node_modules/bootstrap`));

// set up routes for static files
app.use(express.static(`${rootPath}/static`));
// set up server side rendering with ejs
app.set("views", `${rootPath}/ssr`);
app.set("view engine", "ejs");

// make express work with json
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// if ./static/images/generatedOutfits exists, delete all the files in it
// otherwise, make the directory
if (fs.existsSync("./static/images/generatedOutfits")) {
    console.log("Found generatedOutfits directory, clearing ...");
    const files = fs.readdirSync("static/images/generatedOutfits");
    for (let file in files) {
        fs.unlinkSync(`static/images/generatedOutfits/${files[file]}`);
    }
    console.log("cleared generatedOutfits directory.");
} else {
    fs.mkdirSync("./static/images/generatedOutfits");
}

// start server and have it listen to the part
app.listen(process.env.PORT, () => {
    console.log(`Server launched on port ${process.env.PORT}. URL: http://localhost:${process.env.PORT})`);
});
