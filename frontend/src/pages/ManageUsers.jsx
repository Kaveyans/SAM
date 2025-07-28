import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserPlus, FaTrash } from "react-icons/fa";
import "./ManageUsers.css";

const ManageUsers = () => {
    const [showForm, setShowForm] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", department: "" });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/staffs");
            setStaffList(res.data);
        } catch (err) {
            console.error("Error fetching staff:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/api/staffs/${editId}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/staffs", formData);
            }

            setFormData({ name: "", email: "", password: "", department: "" });
            setEditMode(false);
            setShowForm(false);
            setEditId(null);
            fetchStaff();
        } catch (err) {
            console.error("Error adding/updating staff:", err);
            setError("Failed to add/update staff.");
        }
    };

    const handleEdit = (staff) => {
        setEditMode(true);
        setEditId(staff._id);
        setFormData({ name: staff.name, email: staff.email, password: "", department: staff.department });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/staffs/${id}`);
            fetchStaff();
            if (selectedStaff && selectedStaff._id === id) setSelectedStaff(null);
        } catch (err) {
            console.error("Error deleting staff:", err);
            setError("Failed to delete staff.");
        }
    };

    const handleStaffClick = (staff) => {
        setSelectedStaff(staff);
    };

    const filteredStaff = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (departmentFilter === "" || staff.department === departmentFilter)
    );

    return (
        <div className="manage-users-container">
            <div className="manage-users-header">
                <h2>Manage Staff</h2>
                <button
                    className="manage-users-add-btn"
                    onClick={() => {
                        setShowForm(true);
                        setEditMode(false);
                        setEditId(null);
                        setFormData({ name: "", email: "", password: "", department: "" });
                    }}
                >
                    <FaUserPlus /> Add Staff
                </button>
            </div>

            {error && <p className="manage-users-error">{error}</p>}

            <input
                type="text"
                className="manage-users-search-bar"
                placeholder="Search staff by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
                className="manage-users-filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
            >
                <option value="">All Departments</option>
                {[...new Set(staffList.map(staff => staff.department))].map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                ))}
            </select>

            <div className="manage-users-staff-list">
                <h3>Staff List</h3>
                {filteredStaff.length > 0 ? (
                    <ul>
                        {filteredStaff.map((staff) => (
                            <li key={staff._id} onClick={() => handleStaffClick(staff)}>
                                {staff.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No staff members found.</p>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="manage-users-form">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Department:</label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required />

                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editMode} />

                    <div className="manage-users-form-buttons">
                        <button type="submit" className="manage-users-submit-btn">
                            {editMode ? "Update" : "Add"} Staff
                        </button>
                        <button type="button" className="manage-users-cancel-btn" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <table className="manage-users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStaff.map((staff) => (
                        <tr key={staff._id}>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.department}</td>
                            <td>
                                <button onClick={() => handleDelete(staff._id)} className="manage-users-delete-btn">
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

export default ManageUsers;