const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const authenticate = (req, res, next) => {
  if (req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, process.env.APP_SECRET);
    if (decode) {
      next();
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// const auth_role = (roles = async (req, res, next) => {
//   let { username } = req.body;
//   const user = await pool.query("SELECT * FROM user_table WHERE username=$1", [
//     username,
//   ]);
//   !roles.includes(user.rows[0].role)
//     ? res.status(401).json("Unauthorized access")
//     : next();
// });

module.exports = authenticate;
