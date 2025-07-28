const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const studentRoutes = require("./Routes/studentRoutes"); 

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", studentRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import Models
const Admin = require("./models/Admin");
const Staff = require("./models/Staff");
const Student = require("./models/Student");
const Course = require("./models/Course");

app.post("/api/students", async (req, res) => {
  try {
      const { rollNumber } = req.body; // Extract roll number from request body

      if (!rollNumber) {
          return res.status(400).json({ message: "⚠️ Roll number is required!" });
      }

      const student = await Student.findOne({ rollNumber });

      if (!student) {
          return res.status(404).json({ message: "⚠️ Student not found!" });
      }

      res.json(student);
  } catch (error) {
      console.error("❌ Error fetching student details:", error);
      res.status(500).json({ message: "⚠️ Internal Server Error" });
  }
});




app.get("/api/students/department/:dept", async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.dept });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/courses/semester/:sem", async (req, res) => {
  try {
    const courses = await Course.find({ semester: req.params.sem });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/get-marks/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ marks: student.marks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/update-sgpa", async (req, res) => {
  try {
    const { rollNumber, semester, sgpa } = req.body;
    
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.sgpa = sgpa;
    await student.save();

    res.json({ message: "SGPA updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/students/:rollNumber/marks", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const newMark = req.body;

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    student.marks.push(newMark);
    await student.save();

    res.status(200).json({ message: "Marks updated successfully!" });
  } catch (error) {
    console.error("❌ Error saving marks:", error);
    res.status(500).json({ message: "Server error while saving marks." });
  }
});








app.get("/api/students/department/:department/semester/:semester", async (req, res) => {
  try {
    const { department, semester } = req.params;
    const students = await Student.find({ department, semester });

    if (!students.length) {
      return res.status(404).json({ message: "No students found for the selected department and semester." });
    }

    res.json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error while fetching students." });
  }
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
  try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
          return res.status(400).json({ message: "⚠️ Email, password, and role are required!" });
      }

      let user;
      if (role === "staff") {
          user = await Staff.findOne({ email }); // Search in Staff collection
      } else if (role === "student") {
          user = await Student.findOne({ email }); // Search in Student collection
      } else {
          return res.status(400).json({ message: "⚠️ Invalid role selected!" });
      }

      if (!user) {
          return res.status(404).json({ message: "⚠️ User not found!" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "⚠️ Incorrect password!" });
      }

      // ✅ Generate JWT Token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: role },
        process.env.JWT_SECRET,  // ✅ Use process.env to access the secret
        { expiresIn: "1h" }
    );
    

      res.json({ token, role, message: "✅ Login successful!" });
  } catch (error) {
      console.error("❌ Login Error:", error);
      res.status(500).json({ message: "⚠️ Internal Server Error" });
  }
});



// ✅ Fetch All Students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add New Student
app.post("/api/students", async (req, res) => {
  try {
    const { name, rollNumber, email, password, address, semester, department } = req.body;
    if (!name || !rollNumber || !email || !password || !address || !semester || !department) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    const existingStudent = await Student.findOne({ $or: [{ rollNumber }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ message: "❌ Student with this roll number or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, rollNumber, email, password: hashedPassword, address, semester, department });
    await newStudent.save();

    res.status(201).json({ message: "✅ Student added successfully", student: newStudent });
  } catch (error) {
    console.error("❌ Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Delete Student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "❌ Student not found" });
    res.json({ message: "✅ Student deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Course Management APIs
app.post("/api/courses", async (req, res) => {
  try {
    const { name, code, instructor, department, credit, semester } = req.body;
    if (!name || !code || !instructor || !department || credit === undefined || !semester) {
      return res.status(400).json({ message: "❌ All fields, including semester and credit, are required" });
    }
    const newCourse = new Course({ name, code, instructor, department, credit, semester });
    await newCourse.save();
    res.status(201).json({ message: "✅ Course added successfully", course: newCourse });
  } catch (error) {
    console.error("❌ Error adding course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Course
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "❌ Course not found" });
    res.json({ message: "✅ Course deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Fetch All Staff Members
// ✅ Fetch All Staff
app.get("/api/staffs", async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (error) {
    console.error("❌ Error fetching staff:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add New Staff Member
app.post("/api/staffs", async (req, res) => {
  try {
    const { name, email, password, department} = req.body;
    if (!name || !email || !password || !department ) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "❌ Staff with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = new Staff({ name, email, password: hashedPassword, department });
    await newStaff.save();

    res.status(201).json({ message: "✅ Staff added successfully", staff: newStaff });
  } catch (error) {
    console.error("❌ Error adding staff:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Staff Member
app.delete("/api/staffs/:id", async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "❌ Staff member not found" });
    res.json({ message: "✅ Staff member deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting staff member:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// ✅ Fetch students by department and semester
app.get("/api/students/department/:department/semester/:semester", async (req, res) => {
  try {
    const { department, semester } = req.params;
    const students = await Student.find({ department, semester });

    // ✅ Ensure SGPA is included in response
    const updatedStudents = students.map((student) => ({
      _id: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
      semester: student.semester,
      sgpa: student.sgpa.get(semester) || "N/A"  // ✅ Fetch SGPA for the selected semester
    }));

    res.json(updatedStudents);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Fetch courses by department and semester
app.get("/api/courses/:department/:semester", async (req, res) => {
  try {
    const { department, semester } = req.params;
    const courses = await Course.find({ department, semester });

    if (!courses.length) {
      return res.status(404).json({ message: "❌ No courses found." });
    }

    res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Server error while fetching courses." });
  }
});


// ✅ Save marks for a student
app.post("/api/marks/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const { marks } = req.body;

    // Fetch Student
    let student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // ✅ Format Marks Data
    const formattedMarks = marks.map(mark => ({
      subject: mark.subject || "Unknown",
      sem: mark.sem || student.semester,
      cat1: mark.cat1 || 0,
      cat2: mark.cat2 || 0,
      sem_mark: mark.sem_mark || 0,
      modelPractical: mark.modelPractical || 0,
      semPractical: mark.semPractical || 0
    }));

    // ✅ Save Marks in Student Document
    student.marks = formattedMarks;
    await student.save();

    res.json({ message: "✅ Marks saved successfully!", student });
  } catch (error) {
    console.error("❌ Error saving marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
