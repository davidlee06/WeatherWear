const server = require("./express_config");
const root_path = require("./root_path");
const outfits = require("./jimp_init");
const jimp = require("jimp");
const google = require("./google_auth");
const db = require("./db_connect");
let baseImage;
jimp.read(`${root_path}/static/outfits/stick_figure_base.png`).then((image) => {
    baseImage = image;
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
        const headIndex = Math.floor(Math.random() * outfits[section]["head"].length);
        const head = outfits[section]["head"][headIndex];
        const torsoIndex = Math.floor(Math.random() * outfits[section]["torso"].length);
        const torso = outfits[section]["torso"][torsoIndex];
        const legsIndex = Math.floor(Math.random() * outfits[section]["legs"].length);
        const legs = outfits[section]["legs"][legsIndex];
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
        image.getBuffer(jimp.AUTO, (_, buffer) => {
            db.query(
                "insert into weatherwear.outfit (image_category, feet_id, head_id, legs_id, torso_id) values ($1, $2, $3, $4, $5) returning id;",
                [section, feetIndex, headIndex, legsIndex, torsoIndex]
            )
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

function parseImageInfo(imageInfo) {
    imageInfo["feet_id"] = Number(imageInfo["feet_id"]);
    imageInfo["head_id"] = Number(imageInfo["head_id"]);
    imageInfo["legs_id"] = Number(imageInfo["legs_id"]);
    imageInfo["torso_id"] = Number(imageInfo["torso_id"]);
}
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
        db.query("select * from weatherwear.outfit where id = $1;", [request.query.image_id])
            .then(({rows}) => {
                imageInfo = rows[0];
                parseImageInfo(imageInfo);
                let image = baseImage.clone();
                image.blit(
                    outfits[imageInfo["image_category"]]["head"][imageInfo["head_id"]]["image"],
                    outfits[imageInfo["image_category"]]["head"][imageInfo["head_id"]]["x"],
                    outfits[imageInfo["image_category"]]["head"][imageInfo["head_id"]]["y"]
                );
                image.blit(
                    outfits[imageInfo["image_category"]]["legs"][imageInfo["legs_id"]]["image"],
                    outfits[imageInfo["image_category"]]["legs"][imageInfo["legs_id"]]["x"],
                    outfits[imageInfo["image_category"]]["legs"][imageInfo["legs_id"]]["y"]
                );
                image.blit(
                    outfits[imageInfo["image_category"]]["torso"][imageInfo["torso_id"]]["image"],
                    outfits[imageInfo["image_category"]]["torso"][imageInfo["torso_id"]]["x"],
                    outfits[imageInfo["image_category"]]["torso"][imageInfo["torso_id"]]["y"]
                );
                image.blit(
                    outfits[imageInfo["image_category"]]["feet"][imageInfo["feet_id"]]["image"],
                    outfits[imageInfo["image_category"]]["feet"][imageInfo["feet_id"]]["x"],
                    outfits[imageInfo["image_category"]]["feet"][imageInfo["feet_id"]]["y"]
                );
                image.blit(
                    outfits[imageInfo["image_category"]]["feetFlipped"][imageInfo["feet_id"]]["image"],
                    outfits[imageInfo["image_category"]]["feetFlipped"][imageInfo["feet_id"]]["x"],
                    outfits[imageInfo["image_category"]]["feetFlipped"][imageInfo["feet_id"]]["y"]
                );

                image.getBuffer(jimp.AUTO, (_, buffer) => {
                    response.write(buffer, () => {
                        response.end();
                    });
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
server.post("/api/auth/google", (request, response) => {
    // check that credential is provided in request
    if (!request.body.credential) {
        response.statusCode = 400;
        response.send("A google credential JWT must be sent.");
    } else {
        response.cookie("token", request.body.credential);
        response.redirect("/");
    }
});

server.get("/api/locker-image-info", (request, response) => {
    if (!request.cookies.token) {
        response.statusCode = 400;
        response.send("No cookie sent");
    } else {
        // verify google token
        google
            .verifyIdToken({idToken: request.cookies.token, audience: process.env.GOOGLE_CLIENT_ID})
            .then((ticket) => {
                const user = ticket.getPayload();
                db.query("select id, time_created from weatherwear.outfit where user_id = $1;", [user.sub])
                    .then(({rows}) => {
                        response.statusCode = 200;
                        response.send(rows);
                    })
                    .catch((error) => {
                        response.statusCode = 500;
                        response.send("database issue");
                        console.log(error);
                    });
            })
            .catch(() => {
                response.statusCode = 401;
                response.clearCookie("token");
                response.send("Invalid google auth token");
            });
    }
});

server.post("/api/remove-locker-outfit", (request, response) => {
    if (!(request.cookies.token && request.body.image_id)) {
        response.statusCode = 400;
        response.send("Send a cookie with token and a request body with image_id");
    } else {
        google
            .verifyIdToken({idToken: request.cookies.token, audience: process.env.GOOGLE_CLIENT_ID})
            .then((ticket) => {
                const user = ticket.getPayload();
                db.query("delete from weatherwear.outfit where user_id = $1 and id = $2;", [
                    user.sub,
                    request.body.image_id
                ])
                    .then(() => {
                        response.statusCode = 200;
                        response.send("Removed from locker");
                    })
                    .catch((error) => {
                        response.statusCode = 500;
                        response.send("database issue");
                        console.log(error);
                    });
            })
            .catch(() => {
                response.statusCode = 401;
                response.clearCookie("token");
                response.send("Invalid google auth token");
            });
    }
});

server.post("/api/add-locker-outfit", (request, response) => {
    if (!(request.cookies.token && request.body.image_id)) {
        response.statusCode = 400;
        response.send("Send a cookie with token and a request body with image_id");
    } else {
        google
            .verifyIdToken({idToken: request.cookies.token, audience: process.env.GOOGLE_CLIENT_ID})
            .then((ticket) => {
                const user = ticket.getPayload();
                db.query("update weatherwear.outfit set user_id = $1 where id = $2;", [user.sub, request.body.image_id])
                    .then(() => {
                        response.statusCode = 200;
                        response.send("Added to locker");
                    })
                    .catch((error) => {
                        response.statusCode = 500;
                        response.send("database issue");
                        console.log(error);
                    });
            })
            .catch(() => {
                response.statusCode = 401;
                response.clearCookie("token");
                response.send("Invalid google auth token");
            });
    }
});

module.exports = server;
