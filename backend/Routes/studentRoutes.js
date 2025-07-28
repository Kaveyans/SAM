const express = require("express");
const { addOrUpdateMarks } = require("../controllers/studentController");

const router = express.Router();

router.post("/update-marks", addOrUpdateMarks);

module.exports = router;
