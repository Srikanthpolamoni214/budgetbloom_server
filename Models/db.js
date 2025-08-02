const mysql = require("mysql2");
const dotenv = require("dotenv")
dotenv.config()
const pool = mysql.createPool({
  host: process.env.HOST,
  user : process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,

connectionLimit: 10,
waitForConnections: true,
queueLimit: 0,
multipleStatements: true

  
});
module.exports = pool