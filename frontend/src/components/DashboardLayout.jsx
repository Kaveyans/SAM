import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import profilePic from "../assets/kct logo.avif";



const DashboardLayout = ({ role, children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const sidebarOptions = {
        admin: [
            { name: "Manage staff", path: "/admin-dashboard/manage-users" },
            { name: "Manage Courses", path: "/admin-dashboard/manage-courses" }
        ],
        staff: [
            { name: "Manage Students", path: "/staff-dashboard/manage-students" },
            { name: "Manage Marks", path: "/staff-dashboard/manage-marks" }
        ],
        student: [
            { name: "View Records", path: "/student-dashboard/view-records" },
            { name: "Enroll Courses", path: "/student-dashboard/enroll-courses" }
        ],
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="profile-section">
                <img src={profilePic} alt="Profile" className="profile-pic" />
                <h3>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h3>
                </div>
                <ul>
                    {sidebarOptions[role].map((item, index) => (
                        <li key={index} onClick={() => navigate(item.path)}>{item.name}</li>
                    ))}
                </ul>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
