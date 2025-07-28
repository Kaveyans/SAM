import React, { useState, useEffect } from "react";
import "./ManageMarks.css";

const ManageMarks = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState({});

  // Fetch students when department & semester are selected
  useEffect(() => {
    if (department && semester) {
      fetch(`http://localhost:5000/api/students/department/${department}/semester/${semester}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Students:", data);
          setStudents(data);
          setFilteredStudents(data);
        })
        .catch((err) => console.error("❌ Error fetching students:", err));
    } else {
      setStudents([]);
      setFilteredStudents([]);
    }
  }, [department, semester]);

  // Search students by name
  useEffect(() => {
    if (searchQuery) {
      setFilteredStudents(
        students.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  // Fetch courses when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      console.log("Fetching courses for:", selectedStudent.department, selectedStudent.semester);

      fetch(`http://localhost:5000/api/courses/${selectedStudent.department}/${selectedStudent.semester}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Courses fetched:", data);

          if (Array.isArray(data) && data.length > 0) {
            setCourses(data);

            // Initialize marks state properly
            const initialMarks = {};
            data.forEach((course) => {
              initialMarks[course.courseCode] = {
                cat1: "",
                cat2: "",
                sem_mark: "",
                modelPractical: "",
                semPractical: ""
              };
            });
            setMarks(initialMarks);
            console.log("Initialized Marks:", initialMarks);
          } else {
            setCourses([]);
            setMarks({});
          }
        })
        .catch((err) => console.error("❌ Error fetching courses:", err));
    } else {
      setCourses([]);
      setMarks({});
    }
  }, [selectedStudent]);

  // Handle mark input change
  const handleMarksChange = (courseCode, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [courseCode]: {
        ...prev[courseCode],
        [field]: value
      }
    }));
  };

  // Save marks to database
  const saveMarks = () => {
    if (!selectedStudent) {
      alert("Please select a student first!");
      return;
    }

    fetch(`http://localhost:5000/api/marks/${selectedStudent.rollNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marks: Object.entries(marks).map(([courseCode, markData]) => ({
          subject: courseCode,  // ✅ Ensures subject is present
          sem: selectedStudent.semester,  // ✅ Ensures semester is included
          ...markData
        }))
      })
    })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Marks saved successfully!");
        console.log("Saved Marks:", data);
      })
      .catch((err) => console.error("❌ Error saving marks:", err));
    }    

  return (
    <div className="container">
      <h2>Manage Marks</h2>

      {/* Select Department */}
      <label>Choose Department:</label>
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">Select Department</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
      </select>

      {/* Select Semester */}
      <label>Choose Semester:</label>
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">Select Semester</option>
        {[...Array(8)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      {/* Student Search */}
      {students.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <table border="1">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  onClick={() => {
                    console.log("Selected student:", student);
                    setSelectedStudent(student);
                  }}
                  style={{
                    backgroundColor: selectedStudent?._id === student._id ? "#d3d3d3" : "white",
                    cursor: "pointer",
                  }}
                >
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Selected Student Details */}
      {selectedStudent && (
        <div className="student-details">
          <h3>Student Details</h3>
          <p><strong>Roll No:</strong> {selectedStudent.rollNumber}</p>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Semester:</strong> {selectedStudent.semester}</p>
        </div>
      )}

      {/* Marks Entry Form */}
      {selectedStudent && courses.length > 0 && (
        <div className="marks-section">
          <h3>Enter Marks</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Course</th>
                <th>Course Code</th>
                <th>CAT 1</th>
                <th>CAT 2</th>
                <th>Semester</th>
                <th>Model Practical</th>
                <th>Sem Practical</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.code}>  {/* Ensure 'code' is unique */}
                  <td>{course.name}</td>
                  <td>{course.code}</td>  {/* Display Course Code */}
                  <td>
                    <input
                      type="number"
                      value={marks[course.code]?.cat1 || ""}
                      onChange={(e) => handleMarksChange(course.code, "cat1", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={marks[course.code]?.cat2 || ""}
                      onChange={(e) => handleMarksChange(course.code, "cat2", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={marks[course.code]?.sem_mark || ""}
                      onChange={(e) => handleMarksChange(course.code, "sem_mark", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={marks[course.code]?.modelPractical || ""}
                      onChange={(e) => handleMarksChange(course.code, "modelPractical", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={marks[course.code]?.semPractical || ""}
                      onChange={(e) => handleMarksChange(course.code, "semPractical", e.target.value)}
                    />
                  </td>
                </tr>
              ))}


            </tbody>
          </table>
          <button onClick={saveMarks}>Save Marks</button>
        </div>
      )}
    </div>
  );
};

export default ManageMarks;
