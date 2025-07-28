import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ManageUsers from "./ManageUsers"; // Import the new component
import ManageCourses from "./ManageCourses"; // Another page

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout role="admin" onMenuClick={(path) => navigate(path)}>
            <Routes>
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-courses" element={<ManageCourses />} />
                <Route path="/*" element={<h2>Welcome, Admin! Select an option from the sidebar.</h2>} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboard;
