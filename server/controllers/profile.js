const express = require("express");
const router = express.Router();

const pool = require("../config/db");

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

module.exports = edit_profile;
