const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
const globalErrorHandler = require("./middlewares/errorHandler");
const AppError = require("./error/AppError");
const { swaggerUi, swaggerSpec } = require("./swagger");

require("dotenv").config();

const app = express();

const whiteList = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps or curl requests)
        if (!origin || whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new AppError("Not allowed by CORS", 403));
        }
    },
    credentials: true, // Enable cookies to be sent with CORS
    optionsSuccessStatus: 200,
};

// Apply CORS and other middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// Swagger documentation setup
// This will serve Swagger UI only at the `/api/v1/docs` route
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get("/api/v1/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working!",
    });
});

// User routes (login should be here)
app.use("/api/v1/user", userRoutes);

// Handle undefined routes with AppError
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
