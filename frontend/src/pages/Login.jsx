import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); // Default to student
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log("🔹 Sending Login Request:", { email, password, role });

        try {
            const response = await axios.post("http://localhost:5000/api/login", 
                { email, password, role },  // ✅ Sending role
                { headers: { "Content-Type": "application/json" } } 
            );

            console.log("✅ Login Response:", response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);

                setMessage("✅ Login successful!");

                // ✅ Redirect based on role
                const userRole = response.data.role?.toLowerCase(); 
                console.log("🔹 Redirecting based on role:", userRole);

                setTimeout(() => {
                    if (userRole === "admin") navigate("/admin-dashboard");
                    else if (userRole === "staff") navigate("/staff-dashboard");
                    else if (userRole === "student") navigate("/student/:rollNumber");
                    else navigate("/"); // Fallback
                }, 500);

            } else {
                setMessage("⚠️ Invalid response from server.");
            }
        } catch (error) {
            console.error("❌ Login Error:", error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.message || "⚠️ Invalid credentials or server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="background"></div> 
            <div className="login-form-container">
                <div className="login-form">
                    <h2>Login</h2>
                    {message && <p>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
