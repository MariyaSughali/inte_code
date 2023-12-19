const express = require("express");
const pool = require("../config/db");

// Getting list of users
const userlist = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_table INNER JOIN language ON language.language_id = user_table.language_id INNER JOIN role ON role.role_id = user_table.role_id WHERE user_table.isactive = TRUE AND NOT role.role_id=3"
    );
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Getting users went wrong");
  }
};

//Get all the roles
const roles_list = async (req, res) => {
  try {
    const roles = await pool.query(
      "SELECT role_id, role_name FROM role WHERE NOT role.role_id=3 "
    );
    res.status(200).send(roles.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Getting roles list went wrong");
  }
};

// Get one user
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query(
      "SELECT * FROM user_table INNER JOIN language ON language.language_id = user_table.language_id INNER JOIN role ON role.role_id = user_table.role_id WHERE id= $1",
      [id]
    );
    res.status(200).send(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Getting user went wrong");
  }
};

// Updating the user role
const updateUser_role = async (req, res) => {
  const { id, role_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE user_table SET role_id= $1 WHERE id = $2",
      [role_id, id]
    );
    if (result.rowCount == 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated successfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Updating user went wrong");
  }
};

// Update user information
const updateUser = async (req, res) => {
  const { id, first_name, last_name, email, phone_number } = req.body;
  try {
    const update = await pool.query(
      "UPDATE user_table SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE id = $5",
      [first_name, last_name, email, phone_number, id]
    );
    console.log(update);
    res.status(200).send("data updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Updating user went wrong");
  }
};
// Delete the User
const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const deleteUser = await pool.query(
      "UPDATE user_table SET isactive = FALSE WHERE id=$1",
      [id]
    );
    if (deleteUser) {
      res.status(200).send("User Deleted Successfully");
    } else {
      res.status(500).send("User Deletion Failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Deleting user went wrong");
  }
};

module.exports = {
  userlist,
  updateUser_role,
  deleteUser,
  getUser,
  updateUser,
  roles_list,
};
