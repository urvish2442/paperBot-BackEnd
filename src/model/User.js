// User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, default: null },
    email: { type: String, default: null, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
