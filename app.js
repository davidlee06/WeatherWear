const express = require("express");
const app = express();
const port = 8080;
const logger = require("morgan");

// get morgan logger to write to console
app.use(logger("dev"));

// public folder will have all javascripts htmls and css that our page will render
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/html");
app.set("view engine", "ejs");

// make express work with post requests: make sure to JSON.stringify the bodies of all post requests from frontend, sending just javascript objects will result in empty body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

// start server and have it listen to the part
app.listen(port, () => {
    console.log(
        `App server listening on ${port}. URL: http://localhost:${port})`
    );
});
