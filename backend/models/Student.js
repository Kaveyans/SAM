const mongoose = require("mongoose");

// Marks Schema (Embedded inside Student Schema)
const markSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  cat1: { type: Number, default: 0, min: 0, max: 50 },
  cat2: { type: Number, default: 0, min: 0, max: 50 },
  sem: { type: Number, required: true, min: 0, max: 100 },
  modelPractical: { type: Number, default: 0, min: 0, max: 100 },
  semPractical: { type: Number, default: 0, min: 0, max: 100 }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  semester: { type: Number, required: true, min: 1 },
  department: { type: String, required: true },
  marks: { type: [markSchema], default: [] }, // Marks array
  sgpa: { type: Map, of: Number, default: {} }, // SGPA stored as a map with semester as key
  scgpa: { type: Number, default: 0 } // ✅ Cumulative SGPA (CGPA)
});

// Export Model
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
