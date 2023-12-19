const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if username and password fields are filled
    if (!username || !password) {
      res.status(400).json({ message: "Please enter username and password" });
    }
    // Check if the user exists
    let user = await pool.query(
      "SELECT * FROM user_table INNER JOIN language ON language.language_id = user_table.language_id INNER JOIN role ON role.role_id = user_table.role_id WHERE username = $1 OR email=$2 ",
      [username, username]
    );

    user = user.rows[0];

    // check user password
    if (user) {
      let valid_password = await bcrypt.compareSync(password, user.password);
      if (valid_password) {
        // generate token
        const user_info = { user_id: user.id, email: user.email };
        const token = jwt.sign(user_info, process.env.APP_SECRET, {
          expiresIn: "2h",
        });
        // save token in cookie
        // res.cookie("token", token, {
        //   httpOnly: true,
        //   maxAge: 2 * 60 * 60 * 1000,
        // });

        res.status(200).json({
          token: token,
          role: user.role_name,
          username: user.username,
          id: user.id,
        });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(401).json({ message: "User does not exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
module.exports = login;
