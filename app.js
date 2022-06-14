const express = require("express");
const app = express();
const logger = require("morgan");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();
const port = process.env.port;
const apiKey = process.env.apiKey;
const fs = require("fs");
const jimp = require("jimp");

let imageId = -1;
const oldFiles = fs.readdirSync("public/images/generatedOutfits");
for (file in oldFiles) {
    fs.unlinkSync(`public/images/generatedOutfits/${oldFiles[file]}`);
}

// these are all promises, not actual images
let images = {
    _0C: { head: [], feet: [], feetFlipped: [], legs: [], torso: [] },
    "0-10C": { head: [], feet: [], feetFlipped: [], legs: [], torso: [] },
    "10-20C": { head: [], feet: [], feetFlipped: [], legs: [], torso: [] },
    "20C+": { head: [], feet: [], feetFlipped: [], legs: [], torso: [] },
};
const imageCoords = {
    _0C: {
        head: [201, 0, 202, 0, 189, 0, 212, 0],
        feet: [383, 838, 433, 952, 400, 940, 410, 947],
        feetFlipped: [-26, 838, 21, 952, 7, 940, -20, 947],
        legs: [224, 746, 242, 746, 254, 750, 210, 750],
        torso: [-15, 430, 35, 480, -21, 470, 57, 467],
    },
    "0-10C": {
        head: [201, 0, 202, 0, 189, 0, 212, 0],
        feet: [440, 930, 440, 970, 380, 930, 436, 944],
        feetFlipped: [0, 930, 0, 970, 0, 930, 0, 944],
        legs: [250, 754, 243, 747, 250, 755, 256, 753],
        torso: [50, 462, 13, 468, 28, 472, 75, 480],
    },
    "10-20C": {
        head: [247, 37, 218, 0, 209, 0, 213, 0],
        feet: [440, 930, 440, 970, 380, 930, 436, 944],
        feetFlipped: [0, 930, 0, 970, 0, 930, 0, 944],
        legs: [250, 754, 243, 747, 250, 755, 256, 753],
        torso: [109, 457, 109, 457, 108, 476, 48, 477],
    },
    "20C+": {
        head: [247, 37, 218, 0, 209, 0, 213, 0],
        feet: [440, 930, 440, 970, 380, 930, 436, 944],
        feetFlipped: [0, 930, 0, 970, 0, 930, 0, 944],
        legs: [242, 748, 233, 752, 270, 755, 254, 744],
        torso: [109, 457, 109, 457, 108, 476, 48, 477],
    },
};

async function loadImages() {
    for (const tempRange in images) {
        // for all body parts in each range
        for (const bodyPart in images[tempRange]) {
            // for each file of each body part of each range
            const files = fs.readdirSync(
                `outfitImages/${tempRange}/${bodyPart}`
            );
            for (const file in files) {
                images[tempRange][bodyPart].push(
                    await jimp.read(
                        `outfitImages/${tempRange}/${bodyPart}/${files[file]}`
                    )
                );
            }
        }
    }
    console.log("All outfit component images have been loaded into Jimp. ");
}

loadImages();

// get morgan logger to write to console
app.use(logger("dev"));

// public folder will have all javascripts htmls and css that our page will render
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/html");
app.set("view engine", "ejs");

// make express work with post requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/city", (req, res) => {
    let stringArray = req.body.cityName.split(", ");
    if (stringArray.length < 3) {
        res.statusCode = 404;
        res.send("invalid city type specified");
    }
    axios
        .get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${stringArray[0]},${stringArray[1]},${stringArray[2]}&limit=1&appid=${apiKey}`
        )
        .then((response) => {
            response.data[0];
            axios
                .get(
                    `http://api.openweathermap.org/data/2.5/forecast?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${apiKey}`
                )
                .then((otherResponse) => {
                    otherResponse = otherResponse.data;
                    let newObject = { cityName: req.body.cityName, array: [] };
                    for (let i = 0; i < otherResponse.list.length; ) {
                        let tempTemps = [];
                        let hoursPassed = 0;
                        let tempDateString = new Date(
                            otherResponse.list[i].dt * 1000
                        ).toDateString();
                        hoursPassed = new Date(
                            otherResponse.list[i].dt * 1000
                        ).getHours();
                        while (
                            hoursPassed < 24 &&
                            i < otherResponse.list.length
                        ) {
                            tempTemps.push(otherResponse.list[i].main.temp);
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
                        newObject.array.push([
                            tempDateString,
                            tempTemps[0],
                            tempTemps[tempTemps.length - 1],
                        ]);
                    }
                    res.render("city", newObject);
                });
        });
});

async function generateOutfit(temperature, callback) {
    let stickFigure = await jimp.read("outfitImages/stickFigure.png");
    const head = Math.floor(Math.random() * 4);
    const torso = Math.floor(Math.random() * 4);
    const legs = Math.floor(Math.random() * 4);
    const feet = Math.floor(Math.random() * 4);
    if (temperature < 0) {
        stickFigure.blit(
            images["_0C"]["head"][head],
            imageCoords["_0C"]["head"][head * 2],
            imageCoords["_0C"]["head"][head * 2 + 1]
        );
        stickFigure.blit(
            images["_0C"]["torso"][torso],
            imageCoords["_0C"]["torso"][torso * 2],
            imageCoords["_0C"]["torso"][torso * 2 + 1]
        );
        stickFigure.blit(
            images["_0C"]["legs"][legs],
            imageCoords["_0C"]["legs"][legs * 2],
            imageCoords["_0C"]["legs"][legs * 2 + 1]
        );
        stickFigure.blit(
            images["_0C"]["feet"][feet],
            imageCoords["_0C"]["feet"][feet * 2],
            imageCoords["_0C"]["feet"][feet * 2 + 1]
        );
        stickFigure.blit(
            images["_0C"]["feetFlipped"][feet],
            imageCoords["_0C"]["feetFlipped"][feet * 2],
            imageCoords["_0C"]["feetFlipped"][feet * 2 + 1]
        );
    } else if (0 <= temperature <= 10) {
        stickFigure.blit(
            images["0-10C"]["head"][head],
            imageCoords["0-10C"]["head"][head * 2],
            imageCoords["0-10C"]["head"][head * 2 + 1]
        );
        stickFigure.blit(
            images["0-10C"]["torso"][torso],
            imageCoords["0-10C"]["torso"][torso * 2],
            imageCoords["0-10C"]["torso"][torso * 2 + 1]
        );
        stickFigure.blit(
            images["0-10C"]["legs"][legs],
            imageCoords["0-10C"]["legs"][legs * 2],
            imageCoords["0-10C"]["legs"][legs * 2 + 1]
        );
        stickFigure.blit(
            images["0-10C"]["feet"][feet],
            imageCoords["0-10C"]["feet"][feet * 2],
            imageCoords["0-10C"]["feet"][feet * 2 + 1]
        );
        stickFigure.blit(
            images["0-10C"]["feetFlipped"][feet],
            imageCoords["0-10C"]["feetFlipped"][feet * 2],
            imageCoords["0-10C"]["feetFlipped"][feet * 2 + 1]
        );
    } else if (10 <= temperature <= 20) {
        stickFigure.blit(
            images["10-20C"]["head"][head],
            imageCoords["10-20C"]["head"][head * 2],
            imageCoords["10-20C"]["head"][head * 2 + 1]
        );
        stickFigure.blit(
            images["10-20C"]["torso"][torso],
            imageCoords["10-20C"]["torso"][torso * 2],
            imageCoords["10-20C"]["torso"][torso * 2 + 1]
        );
        stickFigure.blit(
            images["10-20C"]["legs"][legs],
            imageCoords["10-20C"]["legs"][legs * 2],
            imageCoords["10-20C"]["legs"][legs * 2 + 1]
        );
        stickFigure.blit(
            images["10-20C"]["feet"][feet],
            imageCoords["10-20C"]["feet"][feet * 2],
            imageCoords["10-20C"]["feet"][feet * 2 + 1]
        );
        stickFigure.blit(
            images["10-20C"]["feetFlipped"][feet],
            imageCoords["10-20C"]["feetFlipped"][feet * 2],
            imageCoords["10-20C"]["feetFlipped"][feet * 2 + 1]
        );
    } else {
        stickFigure.blit(
            images["20C+"]["head"][head],
            imageCoords["20C+"]["head"][head * 2],
            imageCoords["20C+"]["head"][head * 2 + 1]
        );
        stickFigure.blit(
            images["20C+"]["torso"][torso],
            imageCoords["20C+"]["torso"][torso * 2],
            imageCoords["20C+"]["torso"][torso * 2 + 1]
        );
        stickFigure.blit(
            images["20C+"]["legs"][legs],
            imageCoords["20C+"]["legs"][legs * 2],
            imageCoords["20C+"]["legs"][legs * 2 + 1]
        );
        stickFigure.blit(
            images["20C+"]["feet"][feet],
            imageCoords["20C+"]["feet"][feet * 2],
            imageCoords["20C+"]["feet"][feet * 2 + 1]
        );
        stickFigure.blit(
            images["20C+"]["feetFlipped"][feet],
            imageCoords["20C+"]["feetFlipped"][feet * 2],
            imageCoords["20C+"]["feetFlipped"][feet * 2 + 1]
        );
    }
    imageId++;
    stickFigure.write(`public/images/generatedOutfits/${imageId}.png`);
    callback();
}

app.post("/outfit", (req, res) => {
    // temp comes in at req.body.temp
    // take temperature for valid range, then generate an image and give it an id, then include a string link to it in the response, client will load the image back
    generateOutfit(req.body.temp, () => {
        res.render("outfit", {
            temp: req.body.temp,
            imageURL: `/images/generatedOutfits/${imageId}.png`,
        });
    });
});

// start server and have it listen to the part
app.listen(port, () => {
    console.log(
        `App server listening on ${port}. URL: http://localhost:${port})`
    );
});
