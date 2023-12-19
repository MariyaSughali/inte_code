const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const validatePassword = async (id, password) => {
  "use strict";
  try {
    let user = await pool.query(
      "SELECT password FROM user_table WHERE id = $1",
      [id]
    );
    user = user.rows[0];
    if (user) {
      const validation = await bcrypt.compareSync(password, user.password);
      if (validation) {
        console.log("validation successful");
        return {
          message: "Password validated successfully",
          status: 200,
        };
      } else {
        return {
          error: "Invalid old password",
          status: 401,
        };
      }
    } else {
      console.log("user not found");
      return false;
    }
  } catch (error) {
    console.error(error);
    return {
      error: "password validation error",
      status: 500,
    };
  }
};

module.exports = validatePassword;
