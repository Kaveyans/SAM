const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: "staff" },
});

module.exports = mongoose.model("Staff", StaffSchema);
