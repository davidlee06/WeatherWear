import dotenv from "dotenv";
dotenv.config();

import server from "./ExpressConfig";
require("./ServerRoutes")
// start server and have it listen to the part
server.listen(process.env.PORT, () => {
    console.log(`Server launched on port ${process.env.PORT}. URL: http://localhost:${process.env.PORT})`);
});
