/*
make request to image id api to get ids of all images, then with array of all ids, make requests to get image api to 
get all images
*/
const images_root = document.getElementById("images_root");
fetch("/api/locker-image-info", {credentials: "same-origin"}).then((fetchResponse) => {
    fetchResponse.json().then((array) => {
        if (array.length === 0) {
            document.getElementById("no_outfits").removeAttribute("style");
        }
        for (let a = 0; a < array.length; ++a) {
            images_root.innerHTML += `<div id="image-${a}"><h3 style="margin-top: 10px; margin-bottom: 10px;">Outfit #${
                a + 1
            }: Time created: ${array[a]["time_created"]}</h3><img src = "/api/get-image?image_id=${
                array[a]["id"]
            }"/><button class = "btn btn-primary remove_button"
            }">Remove this outfit from locker</button></div>`;
        }
        const remove_buttons = document.getElementsByClassName("remove_button");
        for (let a = 0; a < remove_buttons.length; ++a) {
            remove_buttons[a].addEventListener("click", () => {
                fetch("/api/remove-locker-outfit", {
                    credentials: "same-origin",
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({image_id: array[a]["id"]})
                }).then(() => {
                    const image = document.getElementById("image-" + a);
                    image.remove();
                });
            });
        }
    });
});
