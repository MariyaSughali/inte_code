const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// Get one file data by file_id
const getfiledata = async (req, res) => {
  const { file_id } = req.params; // Corrected destructuring of params

  try {
    const user = await pool.query("SELECT * FROM inbox WHERE file_id = $1", [
      file_id,
    ]);

    if (user.rows.length === 0) {
      // If no user found with that file_id
      return res.status(404).send("File data not found");
    }

    res.status(200).send(user.rows[0]); // Sending the first result row
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching file data");
  }
};

module.exports = getfiledata;
