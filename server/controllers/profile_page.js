const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const validation = require("../middleware/validation");

const getUserData = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT * FROM user_table u
    JOIN language l ON l.language_id= u.language_id
    JOIN role r ON r.role_id= u.role_id WHERE id=$1`,
    [id]
  );
  res.json(result.rows);
};

const edit_profile = async (req, res) => {
  try {
    const { email, phone_number, id } = req.body;

    function validateEmail(email) {
      var email_pattern = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.com$/;
      return email_pattern.test(email);
    }
    //   if email is invalid
    if (!validateEmail) {
      res.status(400).json({ message: "invalid email" });
    }
    function validatePhone(phone_number) {
      var phone_pattern = /^\d{10}$/;
      return phone_pattern.test(phone_number);
    }
    //if  phone number is invalid
    if (!validatePhone(phone_number)) {
      res.status(400).json({ message: "invalid phone number" });
    }
    const update_profile = await pool.query(
      "UPDATE user_table SET email = $1, phone_number = $2 WHERE id = $3",
      [email, phone_number, id]
    );
    if (update_profile) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      console.log(update_profile);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Editing profile data went wrong" });
  }
};

const change_password = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  let result = await validation(id, oldPassword);
  if (result) {
    try {
      //   console.log("success");
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(newPassword, salt);
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

module.exports = { getUserData, edit_profile, change_password };
