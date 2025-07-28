import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaTrash } from "react-icons/fa";
import "./ManageStudents.css";

const ManageStudents = () => {
    const [studentList, setStudentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        rollNumber: "",
        email: "",
        address: "",
        semester: "",
        department: "",  // ✅ Added department field
        password: ""
    });

    useEffect(() => {
        fetchStudents();
    }, []);
    
    const fetchStudents = () => {
        axios.get("http://localhost:5000/api/students")
            .then(response => setStudentList(response.data))
            .catch(error => console.error("Error fetching student data:", error));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            axios.put(`http://localhost:5000/api/students/${formData.id}`, formData)
                .then(() => {
                    fetchStudents();
                    resetForm();
                })
                .catch(error => console.error("Error updating student:", error));
        } else {
            axios.post("http://localhost:5000/api/students", formData)
                .then(() => {
                    fetchStudents();
                    resetForm();
                })
                .catch(error => console.error("Error adding student:", error));
        }
        setShowForm(false);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/students/${id}`)
            .then(() => {
                setStudentList(studentList.filter(student => student._id !== id));
            })
            .catch(error => console.error("Error deleting student:", error));
    };

    return (
        <div className="manage-student-container">
            <div className="manage-header">
                <h2>Manage Students</h2>
                <button className="manage-add-btn" onClick={() => setShowForm(true)}>
                    <FaUserPlus /> Add Student
                </button>
            </div>

            <input
                type="text"
                className="manage-search-input"
                placeholder="Search student by roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {showForm && (
                <form onSubmit={handleSubmit} className="manage-form-container">
                    <div className="manage-form-grid">
                        <input type="text" name="name" placeholder="Name" className="manage-form-input" value={formData.name} onChange={handleChange} required />
                        <input type="text" name="rollNumber" placeholder="Roll Number" className="manage-form-input" value={formData.rollNumber} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" className="manage-form-input" value={formData.email} onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Address" className="manage-form-input" value={formData.address} onChange={handleChange} required />
                        <input type="number" name="semester" placeholder="Semester" className="manage-form-input" value={formData.semester} onChange={handleChange} required />
                        <select name="department" className="manage-form-input" value={formData.department} onChange={handleChange} required>
                            <option value="">Select Department</option>
                            <option value="CSE">Computer Science</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="MECH">Mechanical</option>
                            <option value="EEE">Electrical</option>
                            <option value="CIVIL">Civil</option>
                        </select>
                        <input type="password" name="password" placeholder="Password" className="manage-form-input" value={formData.password} onChange={handleChange} required={!editMode} />
                    </div>
                    <div className="manage-form-buttons">
                        <button type="submit" className="manage-submit-btn">{editMode ? "Update" : "Add"} Student</button>
                        <button type="button" className="manage-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            <table className="manage-student-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Semester</th>
                        <th>Department</th>  {/* ✅ Added Department Column */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.filter(student => student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.rollNumber}</td>
                            <td>{student.email}</td>
                            <td>{student.address}</td>
                            <td>{student.semester}</td>
                            <td>{student.department}</td> {/* ✅ Displaying Department */}
                            <td>
                                <button onClick={() => handleDelete(student._id)} className="manage-delete-btn">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageStudents;
