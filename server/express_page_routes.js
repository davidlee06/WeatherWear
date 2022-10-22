const server = require("./express_api_routes");
const root_path = require("./root_path");

server.get("/", (request, response) => {
    // user is signed in if they send a token cookie with their request
    // if user is signed in, send them to index-signed-in page
    if (request.cookies.token) {
        response.sendFile(`${root_path}/pages/index-signed-in.html`);
    }
    // otherwise, put them on standard index page with no sign in
    else {
        response.sendFile(`${root_path}/pages/index.html`);
    }
});

server.get("/city", (request, response) => {
    response.sendFile(`${root_path}/pages/city.html`);
});

server.get("/locker", (request, response) => {
    // if user is not signed in, bring them back to home page
    if (!request.cookies.token) {
        response.redirect("/");
    } else {
        response.sendFile(`${root_path}/pages/locker.html`);
    }
});

module.exports = server;
