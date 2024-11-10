const AppError = require("../error/AppError");

// MongoDB Error Handlers
const handleCastErrorDB = (err) =>
    new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    return new AppError(`Validation error: ${errors.join(". ")}`, 400);
};

// Generic Error Handler
const globalErrorHandler = (err, req, res, next) => {
    // Set default values for status and message
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err, message: err.message };

        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);

        res.status(error.statusCode).json({
            status: error.status,
            message: error.isOperational
                ? error.message
                : "Something went wrong!",
        });
    }
};

module.exports = globalErrorHandler;
