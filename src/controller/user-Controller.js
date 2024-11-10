// user-Controller.js
const AppError = require("../error/AppError");
const User = require("../model/User");
const { catchAsyncError } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("User not found", 400));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError("Invalid password", 400));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    const { password: removePassword, ...userData } = user.toObject();
    return res.json({ success: true, token, data: userData });
});

exports.register = catchAsyncError(async (req, res, next) => {
    const { email, password, userName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("User already exists", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        email,
        password: hashedPassword,
    });
    await newUser.save();
    const { password: passwordToRemove, ...userData } = newUser.toObject();
    res.json({
        success: true,
        message: "User registered successfully",
        data: userData,
    });
});
