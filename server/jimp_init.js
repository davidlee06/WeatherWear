/*
Load all images into jimp from disk and into image object
*/
const root_path = require("./root_path");
const outfits = require(`${root_path}/static/outfits/outfit_coordinates.json`);
const jimp = require("jimp");

async function loadImages() {
    const categories = Object.keys(outfits);
    for (let a = 0; a < categories.length; ++a) {
        const bodyParts = Object.keys(outfits[categories[a]]);
        for (let b = 0; b < bodyParts.length; ++b) {
            const array = outfits[categories[a]][bodyParts[b]];
            for (let c = 0; c < array.length; ++c) {
                array[c]["image"] = await jimp.read(
                    `${root_path}/static/outfits/${categories[a]}/${bodyParts[b]}/${c}.png`
                );
            }
        }
    }
    console.log("all images have been loaded.")
}

loadImages();

module.exports = outfits;
