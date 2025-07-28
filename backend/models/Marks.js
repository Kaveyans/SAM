const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true }, // Student Roll Number
  semester: { type: Number, required: true }, // Student Semester
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  cat1: { type: Number, default: 0 },
  cat2: { type: Number, default: 0 },
  sem: { type: Number, default: 0 },
});

const Marks = mongoose.model("Marks", MarksSchema);
module.exports = Marks;
