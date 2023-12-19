const express = require("express");
const router = express.Router();
const pool = require("../config/db");

//get file data from translator_inbox to be viewed for reviewer
const queueData = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.file_id,
        t.file_name,
        t.assigned_dt,
        t.language_id,
        r.id AS reviewer_id,
        u.username
      FROM translator_inbox t
      LEFT JOIN reviewer_inbox r ON t.file_id = r.file_id
      LEFT JOIN user_table u ON r.id = u.id
      WHERE t.iscompleted = true`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get the data from reviewer_inbox for specific user_id
const myQueueData = async (req, res) => {
  const id = req.params.user_id;
  const result = await pool.query(
    "SELECT * FROM reviewer_inbox  WHERE id =$1",
    [id]
  );
  res.json(result.rows);
};

//assign the file to that user for review
const assignFile = async (req, res) => {
  const { id, file_name, file_id, language_id } = req.body;
  try {
    // get today's date
    const today = new Date();

    const result = await pool.query(
      "INSERT INTO reviewer_inbox (file_id, file_name, id,language_id,assigned_dt) VALUES ($1, $2, $3,$4,$5)",
      [file_id, file_name, id, language_id, today]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// change status to draft
const setToDraft = async (req, res) => {
  const { file_id } = req.body;
  const result = await pool.query(
    "UPDATE reviewer_inbox SET isdraft=true  WHERE file_id=$1",
    [file_id]
  );
  res.json(result.rows);
};
module.exports = { queueData, myQueueData, assignFile, setToDraft };
