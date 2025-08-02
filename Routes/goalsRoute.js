// routes/goalRoute.js
const express = require("express");
const router = express.Router();
const { getGoal, setGoal } = require("../Controllers/goalsContorllers");

router.get("/", getGoal);
router.post("/", setGoal);

module.exports = router;
