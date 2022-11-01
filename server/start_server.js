// check that all env letiables are there
require("dotenv").config();
if (
    process.env.PORT &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.DB_CONNECTION_STRING
) {
    console.log("All enviornment variables loaded");
} else {
    console.log(
        "Not all enviornment variables have been properly declared. Create a .env file and make sure its format " +
            "matches the one on the readme and it includes all of the necessary fields.  "
    );
    process.exit(1);
}

const server = require("./express_page_routes");
server.listen(process.env.PORT, () => {
    console.log(
        `Server sucessfully launched on port ${process.env.PORT}. Go to ` + `http://localhost:${process.env.PORT}`
    );
});
