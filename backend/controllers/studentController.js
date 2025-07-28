const Student = require("../models/Student");

const addOrUpdateMarks = async (req, res) => {
  const { rollNumber, subject, cat1, cat2, sem } = req.body;

  try {
    console.log("Received Data:", { rollNumber, subject, cat1, cat2, sem });

    if (!rollNumber || !subject || !sem) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const subjectIndex = student.marks.findIndex(
      (m) => m.subject === subject && m.sem === sem
    );

    if (subjectIndex !== -1) {
      if (cat1 !== undefined) student.marks[subjectIndex].cat1 = cat1;
      if (cat2 !== undefined) student.marks[subjectIndex].cat2 = cat2;
    } else {
      student.marks.push({ subject, cat1: cat1 || 0, cat2: cat2 || 0, sem });
    }

    console.log("Updated Student Data:", student);

    await student.save();
    return res.status(200).json({ message: "Marks updated successfully", student });

  } catch (error) {
    console.error("Error updating marks:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addOrUpdateMarks };
