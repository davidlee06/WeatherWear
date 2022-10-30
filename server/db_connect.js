const pg = require("pg");
const db = new pg.Client(process.env.DB_CONNECTION_STRING);
db.connect();
module.exports = db;
