import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const { rollNumber } = useParams(); // Get rollNumber from URL
    const [student, setStudent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            if (!rollNumber) {
                setError("⚠️ Roll number is missing.");
                return;
            }
    
            try {
                const response = await axios.post("http://localhost:5000/api/students", { rollNumber }); // ✅ POST request
                setStudent(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "⚠️ Failed to fetch student details.");
            }
        };
    
        fetchStudent();
    }, [rollNumber]);
    

    if (error) return <p className="error">{error}</p>;
    if (!student) return <p className="loading">Loading student details...</p>;

    return (
        <div className="student-container">
            <h2>📚 Student Profile</h2>
            <div className="student-card">
                <h3>{student.name}</h3>
                <p><strong>🎓 Roll No:</strong> {student.rollNumber}</p>
                <p><strong>📧 Email:</strong> {student.email}</p>
                <p><strong>🏠 Address:</strong> {student.address || "N/A"}</p>
                <p><strong>📖 Department:</strong> {student.department}</p>
                <p><strong>📅 Semester:</strong> {student.semester}</p>
                <p><strong>⭐ SCGPA:</strong> {student.scgpa}</p>

                <h3>📑 Marks</h3>
                <table className="marks-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>CAT 1</th>
                            <th>CAT 2</th>
                            <th>Sem Exam</th>
                            <th>Model Practical</th>
                            <th>Sem Practical</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.marks.map((mark, index) => (
                            <tr key={index}>
                                <td>{mark.subject}</td>
                                <td>{mark.cat1}</td>
                                <td>{mark.cat2}</td>
                                <td>{mark.sem}</td>
                                <td>{mark.modelPractical}</td>
                                <td>{mark.semPractical}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDashboard;
