const express = require("express");
const router = express.Router();

//reviewer dashboard
const reviewer = require("../controllers/reviewer_dashboard");
router.get("/getTodoList", reviewer.queueData);
router.get("/getreviewer/:user_id", reviewer.myQueueData);
router.post("/assignFile", reviewer.assignFile);
router.put("/setToDraft", reviewer.setToDraft);

module.exports = router;
