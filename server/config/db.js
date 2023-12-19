const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
});

module.exports = pool;
