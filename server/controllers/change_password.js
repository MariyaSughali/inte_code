const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const validation = require("../middleware/validation");

const change_password = async (req, res) => {
  const { id, password, new_password } = req.body;
  let result = await validation(id, password);
  if (result) {
    try {
      //   console.log("success");
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(new_password, salt);
      await pool.query("UPDATE user_table SET password = $1 WHERE id = $2", [
        hash,
        id,
      ]);
      res
        .status(result.status)
        .json({ message: "Password updated succesfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Updating password went wrong");
    }
  } else {
    res
      .status(401)
      .json({ message: "User is unauthorized to change password" });
  }
};
module.exports = change_password;
