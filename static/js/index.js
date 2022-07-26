// handles user input on the frontend. This code makes sure that the user submits
function callback() {
    const formArray = document.getElementById("textbox").value.split(", ");
    if (formArray.length === 2 && formArray[1].length === 2) {
        document.getElementById("city").setAttribute("value", formArray[0]);
        document.getElementById("state").setAttribute("value", formArray[1]);
        document.getElementById("hidden-form").submit();
    } else {
        alert(
            "You have your location incorrectly. Please use the following format: City, State Code. As of right now, only US cities are supported."
        );
    }
}

document.getElementById("textbox").addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        callback();
    }
    return;
});

document.getElementById("search-button").addEventListener("click", callback);
