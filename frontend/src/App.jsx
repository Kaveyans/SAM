import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            <Route path="/staff-dashboard/*" element={<StaffDashboard />} />
            <Route path="/student/:rollNumber" element={<StudentDashboard />} />

        </Routes>
    );
}

export default App;
