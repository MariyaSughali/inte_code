const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// Post user
const post_user = async (req, res) => {
  try {
    let {
      username,
      first_name,
      last_name,
      password,
      email,
      phone_number,
      language_id,
      created_by,
      created_dt,
      role_id,
      isactive,
      is_first_login,
      profile_pic_link,
    } = req.body;

    let salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    created_dt = new Date();
    created_by = "Admin";
    const add_admin = await pool.query(
      "INSERT INTO user_table( uuid,username, first_name, last_name, password, email, phone_number, language_id, created_by, created_dt, role_id, isactive, is_first_login, profile_pic_link) VALUES (uuid_generate_v4(),$1, $2, $3, $4, $5, $6, $7,$8 ,CURRENT_DATE, $9, $10, $11, $12) RETURNING *",
      [
        username,
        first_name,
        last_name,
        password,
        email,
        phone_number,
        language_id,
        created_by,
        role_id,
        isactive,
        is_first_login,
        profile_pic_link,
      ]
    );
    console.log(add_admin);
    res.status(201).json(add_admin.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = post_user;
