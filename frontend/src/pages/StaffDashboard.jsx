import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import ManageStudents from "./ManageStudents"; 
import ManageMarks from "./ManageMarks"; 
import DashboardLayout from "../components/DashboardLayout";

const StaffDashboard = () => {
    return (
        <DashboardLayout role="staff">
            <Routes>
                {/* ✅ Default staff dashboard view */}
                <Route index element={<h2>Welcome to Staff Dashboard</h2>} />

                {/* ✅ Route for managing students */}
                <Route path="manage-students" element={<ManageStudents />} />
                <Route path="manage-marks" element={<ManageMarks />} />

                {/* ✅ You can add more staff routes here */}
            </Routes>
            <Outlet />
        </DashboardLayout>
    );
};



const styles = {
    container: { textAlign: "center", padding: "50px" },
    button: { padding: "10px 20px", fontSize: "16px", cursor: "pointer" }
};

export default StaffDashboard;
