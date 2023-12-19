const express = require("express");
const router = express.Router();

const getfileData = require("../controllers/audio2text");

router.get("/getfileData/:file_id", getfileData);
module.exports = router;
