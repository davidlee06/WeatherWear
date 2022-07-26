import morgan from "morgan";
import fs from "fs";
import path from "path";
import axios from "axios";
import express from "express";
const app: express.Application = express();
import dotenv from "dotenv";
dotenv.config();
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

/*
if ./static/images/generatedOutfits exists, delete all the files in it
otherwise, make the directory
will remove this later once we add database into the code, we will be storing all the images in the database
*/
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

/* 
route for when the city name is submitted. Find the city's coordinates, then lookup the weather for those 
coordinates, then render the page with those coordinates 
*/
// app.post("/city", (request: express.Request, response: express.Response) => {
//     let stringArray = request.body.cityName.split(", ");
//     // check to see that only two arguments are provided. A city name
//     if (stringArray.length !== 2 || stringArray[1].length !== 2) {
//         response.statusCode = 404;
//         response.send("invalid city type specified");
//     }
//     axios
//         .get(
//             `http://api.openweathermap.org/geo/1.0/direct?q=${stringArray[0]},${stringArray[1]},${stringArray[2]}&limit=1&appid=${apiKey}`
//         )
//         .then((response) => {
//             response.data[0];
//             axios
//                 .get(
//                     `http://api.openweathermap.org/data/2.5/forecast?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${apiKey}`
//                 )
//                 .then((otherResponse) => {
//                     otherResponse = otherResponse.data;
//                     let newObject = {cityName: request.body.cityName, array: []};
//                     for (let i = 0; i < otherResponse.list.length; ) {
//                         let tempTemps = [];
//                         let hoursPassed = 0;
//                         let tempDateString = new Date(otherResponse.list[i].dt * 1000).toDateString();
//                         hoursPassed = new Date(otherResponse.list[i].dt * 1000).getHours();
//                         while (hoursPassed < 24 && i < otherResponse.list.length) {
//                             tempTemps.push(otherResponse.list[i].main.temp);
//                             ++i;
//                             hoursPassed += 3;
//                         }
//                         // sort array, first one will be the smallest temp, other one will be the largest temp
//                         tempTemps.sort((a, b) => {
//                             if (a < b) {
//                                 return -1;
//                             }
//                             if (a > b) {
//                                 return 1;
//                             }
//                             return 0;
//                         });
//                         newObject.array.push([tempDateString, tempTemps[0], tempTemps[tempTemps.length - 1]]);
//                     }
//                     response.render("city", newObject);
//                 });
//         });
// });

app.post("/city", (request: express.Request, response: express.Response) => {
    response.send(request.body);
});
// start server and have it listen to the part
app.listen(process.env.PORT, () => {
    console.log(`Server launched on port ${process.env.PORT}. URL: http://localhost:${process.env.PORT})`);
});
