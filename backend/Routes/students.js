const express = require("express");
const Student = require("../models/Student"); // Adjust path based on your project structure

const router = express.Router();

// GET students with department and semester filter
router.get("/api/students", async (req, res) => {
  const { department, semester } = req.query;
  let query = {};

  if (department) query.department = department;
  if (semester) query.semester = Number(semester); // Convert to number

  try {
    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

module.exports = router;
