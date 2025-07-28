const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/studentDB", { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    rollNumber: String,
    address: String,
    semester: Number,
    registeredCourses: [String],  // List of registered courses
    marks: [{ 
        course: String, 
        cat1: Number,       // CAT 1 Marks
        cat2: Number,       // CAT 2 Marks
        semester: Number    // Semester Marks
    }]
});

const User = mongoose.model("students", studentSchema);

async function addStudent() {
    const hashedPassword = await bcrypt.hash("student123", 10);

    const student = new User({
        email: "student@kct.ac.in",
        password: hashedPassword,
        role: "student",
        rollNumber: "21CS001",
        address: "123, Coimbatore, Tamil Nadu",
        semester: 4,
        registeredCourses: ["CS101", "MA102", "DSA202"],
        marks: [
            { course: "CS101", cat1: 18, cat2: 20, semester: 45 },
            { course: "MA102", cat1: 15, cat2: 17, semester: 40 },
            { course: "DSA202", cat1: 22, cat2: 19, semester: 48 }
        ]
    });

    await student.save();
    console.log("Student added successfully!");
    mongoose.disconnect();
}

addStudent();
