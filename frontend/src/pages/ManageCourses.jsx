import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import "./ManageCourses.css";

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [formData, setFormData] = useState({ name: "", code: "", instructor: "", department: "", credit: "", semester: "" });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("All");
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/courses");
            console.log("Fetched Courses:", res.data); // Debugging
            if (Array.isArray(res.data)) {
                setCourses(res.data);
                setFilteredCourses(res.data);
            } else {
                console.error("Expected an array but received:", res.data);
                setCourses([]);
                setFilteredCourses([]);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        filterCourses(e.target.value.toLowerCase(), selectedSemester, selectedDepartment);
    };

    const handleSemesterFilter = (e) => {
        setSelectedSemester(e.target.value);
        filterCourses(searchQuery, e.target.value, selectedDepartment);
    };

    const handleDepartmentFilter = (e) => {
        setSelectedDepartment(e.target.value);
        filterCourses(searchQuery, selectedSemester, e.target.value);
    };

    const filterCourses = (query, semester, department) => {
        if (!Array.isArray(courses)) {
            console.error("Courses is not an array:", courses);
            return;
        }

        let filtered = courses.filter(course =>
            course.name.toLowerCase().includes(query) ||
            course.code.toLowerCase().includes(query) ||
            course.instructor.toLowerCase().includes(query)
        );

        if (semester !== "All") {
            filtered = filtered.filter(course => course.semester === semester);
        }

        if (department !== "All") {
            filtered = filtered.filter(course => course.department === department);
        }

        setFilteredCourses(filtered);
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/api/courses/${editId}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/courses", formData);
            }

            setFormData({ name: "", code: "", instructor: "", department: "", credit: "", semester: "" });
            setEditMode(false);
            setShowForm(false);
            fetchCourses();
        } catch (err) {
            console.error("Error adding/updating course:", err);
            setError("Failed to add/update course.");
        }
    };

    const handleEdit = (course) => {
        setEditMode(true);
        setEditId(course._id);
        setFormData({ name: course.name, code: course.code, instructor: course.instructor, department: course.department, credit: course.credit || "", semester: course.semester || "" });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}`);
            fetchCourses();
        } catch (err) {
            console.error("Error deleting course:", err);
            setError("Failed to delete course.");
        }
    };

    return (
        <div className="manage-courses-container">
            <div className="manage-courses-header">
                <h2>Manage Courses</h2>
                <div className="manage-courses-filters">
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        value={searchQuery} 
                        onChange={handleSearch} 
                        className="manage-courses-search-input"
                    />
                    <FaSearch className="manage-courses-search-icon" />

                    <select className="manage-courses-filter" value={selectedSemester} onChange={handleSemesterFilter}>
                        <option value="All">All Semesters</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>

                    <select className="manage-courses-filter" value={selectedDepartment} onChange={handleDepartmentFilter}>
                        <option value="All">All Departments</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="EEE">Electrical & Electronics</option>
                        <option value="MECH">Mechanical Engineering</option>
                        <option value="CIVIL">Civil Engineering</option>
                    </select>
                </div>
                
                <button className="manage-courses-add-btn" onClick={() => {
                        setShowForm(true);
                        setEditMode(false);
                        setFormData({ name: "", code: "", instructor: "", department: "", credit: "", semester: "" });
                    }}>
                    <FaPlus /> Add Course
                </button>
            </div>

            {error && <p className="manage-courses-error">{error}</p>}

            {showForm && (
                <form onSubmit={handleSubmit} className="manage-courses-form">
                    <label>Course Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Course Code:</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} required />

                    <label>Instructor:</label>
                    <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required />

                    <label>Department:</label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required />

                    <label>Course Credit:</label>
                    <input type="number" name="credit" value={formData.credit} onChange={handleChange} required />
                    
                    <label>Semester:</label>
                    <input type="text" name="semester" value={formData.semester} onChange={handleChange} required />

                    <button type="submit">{editMode ? "Update" : "Add"} Course</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}

            <table className="manage-courses-table">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Course Code</th>
                        <th>Instructor</th>
                        <th>Department</th>
                        <th>Credit</th>
                        <th>Semester</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCourses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.name}</td>
                            <td>{course.code}</td>
                            <td>{course.instructor}</td>
                            <td>{course.department}</td>
                            <td>{course.credit}</td>
                            <td>{course.semester}</td>
                            <td>
                                <button onClick={() => handleDelete(course._id)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCourses;
