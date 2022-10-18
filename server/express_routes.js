const server = require("./express_config");
const root_path = require("./root_path");

server.get("/", (request, response) => {
    response.sendFile(`${root_path}/pages/index.html`);
});

server.get("/city", (request, response) => {
    response.sendFile(`${root_path}/pages/city.html`);
});


module.exports = server;
