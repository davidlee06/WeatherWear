const server = require("./express_routes");
const db = require("./db_pool");

// test database connection, stop the process if you cannot connect to the database
db.query("select 1 * 1;")
    .then(() => {
        console.log("Established connection with the database. Starting server...");
        server.listen(process.env.PORT, () => {
            console.log(`Server sucessfully launched on port ${process.env.PORT}. Go to http://localhost:${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log("Unable to start server: unable to establish connection with the database. Exiting...");
        process.exit(1);
    });


    