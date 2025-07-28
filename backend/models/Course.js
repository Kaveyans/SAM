const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  instructor: { type: String, required: true },
  department: { type: String, required: true },
  credit: { type: Number, required: true },
  semester: { type: Number, required: true } // ✅ Add this
});

module.exports = mongoose.model("Course", CourseSchema);
