const db = require("./db_pool");
const server = require("./express_config");
const root_path = require("./root_path");
const outfits = require("./jimp_init");
const jimp = require("jimp");
const google = require("./google_auth");
let baseImage;
jimp.read(`${root_path}/static/outfits/stick_figure_base.png`).then((image) => {
    baseImage = image;
});

server.get("/", (request, response) => {
    // user is signed in if they 
});

server.get("/city", (request, response) => {
    response.sendFile(`${root_path}/pages/city.html`);
});

/*
Post here to generate new image, you give it temp in Kelvin, api responds, with id of image to then hit get-image from
*/
server.post("/api/new-image", (request, response) => {
    // check to make sure request has temp field
    if (!request.body.temp || isNaN(request.body.temp)) {
        response.statusCode = 400;
        response.send("Send a temperature in kelvin with a temp field");
    } else {
        // temp number in celsius
        const temperatureC = Number(request.body.temp) - 273.15;
        let section;
        if (temperatureC < 0) {
            section = "_0C";
        } else if (0 <= temperatureC && temperatureC < 10) {
            section = "0-10C";
        } else if (10 <= temperatureC && temperatureC < 20) {
            section = "10-20C";
        } else {
            section = "20C+";
        }
        const head = outfits[section]["head"][Math.floor(Math.random() * outfits[section]["head"].length)];
        const torso = outfits[section]["torso"][Math.floor(Math.random() * outfits[section]["torso"].length)];
        const legs = outfits[section]["legs"][Math.floor(Math.random() * outfits[section]["legs"].length)];
        const feetIndex = Math.floor(Math.random() * outfits[section]["feet"].length);
        const feet = outfits[section]["feet"][feetIndex];
        const feetFlipped = outfits[section]["feetFlipped"][feetIndex];
        const image = baseImage.clone();
        image.blit(head["image"], head["x"], head["y"]);
        image.blit(torso["image"], torso["x"], torso["y"]);
        image.blit(legs["image"], legs["x"], legs["y"]);
        image.blit(feet["image"], feet["x"], feet["y"]);
        image.blit(feetFlipped["image"], feetFlipped["x"], feetFlipped["y"]);
        // write image to database and respond with image id
        image.getBuffer(jimp.AUTO, (error, buffer) => {
            db.query("insert into weatherwear.outfit (image, user_id) values ($1, $2) returning id", [buffer, -1])
                .then(({rows}) => {
                    response.send({image_id: rows[0]["id"]});
                    response.end();
                })
                .catch((error) => {
                    response.statusCode = 500;
                    response.send("db issue");
                    console.log(error);
                });
        });
    }
});

/*
Post here to get image by id, respond with image file
*/
server.get("/api/get-image", (request, response) => {
    // check to make sure query contains image id
    if (!request.query.image_id) {
        response.statusCode = 400;
        response.send("No image id provided. Please provide an image ID in the get request query.");
        response.end();
    } else {
        db.query("select image from weatherwear.outfit where id = $1;", [request.query.image_id])
            .then(({rows}) => {
                response.write(rows[0].image, () => {
                    response.end();
                });
            })
            .catch((error) => {
                response.statusCode = 500;
                response.send("database issue");
                response.end();
                console.log(error);
            });
    }
});

/*
Google authentication route
*/
server.post("/auth/google", (request, response) => {
    // check that credential is provided in request
    if (!request.body.credential) {
        response.statusCode = 400;
        response.send("A google credential JWT must be sent.");
    } else {
        response.cookie("token", request.body.credential);
        response.redirect("/");
    }
});

module.exports = server;
