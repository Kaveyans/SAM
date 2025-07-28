const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "admin" } // ✅ Ensure role is stored
});

module.exports = mongoose.model("Admin", adminSchema);
