/*
make request to image id api to get ids of all images, then with array of all ids, make requests to get image api to 
get all images
*/
const images_root = document.getElementById("images_root");
fetch("/api/locker-image-ids", {credentials: "same-origin"}).then((fetchResponse) => {
    fetchResponse.json().then((array) => {
        for (let a = 0; a < array.length; ++a) {
            images_root.innerHTML += `<div><div>Outfit #${a + 1}: Time created: ${
                array[a]["time_created"]
            }</div><img src = "/api/get-image?image_id=${array[a]["id"]}"/></div>`;
        }
    });
});

