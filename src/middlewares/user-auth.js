const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError"); // adjust the path as needed

exports.userAuth = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return next(new AppError("No token, authorization denied", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError("Token is not valid", 401));
    }
};
