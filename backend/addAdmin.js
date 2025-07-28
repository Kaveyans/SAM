const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/studentDB";

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Admin Schema with Role
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }  // ✅ Ensure role is set
});

const Admin = mongoose.model("Admin", adminSchema);

// ✅ Function to Add Admin
async function addAdmin() {
    try {
        // 🔹 Check if Admin already exists
        const existingAdmin = await Admin.findOne({ email: "admin@kct.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists!");
            mongoose.connection.close();
            return;
        }

        // 🔹 Hash Password & Insert Admin
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const admin = new Admin({ 
            email: "admin@kct.com", 
            password: hashedPassword, 
            role: "admin"  // ✅ Explicitly set role
        });

        await admin.save();
        console.log("✅ Admin added successfully!");

    } catch (err) {
        console.error("❌ Error adding admin:", err);
    } finally {
        mongoose.connection.close(); // ✅ Close connection after operation
    }
}

// ✅ Run the function
addAdmin();
