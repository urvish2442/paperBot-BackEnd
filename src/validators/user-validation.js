const { validateRouteHandler } = require("./validator");

exports.loginValidation = validateRouteHandler({
    email: {
        in: ["body"],
        exists: {
            errorMessage: "Email is required!",
            options: { checkFalsy: true },
        },
        isEmail: {
            errorMessage: "Please enter a valid email address",
        },
    },
    password: {
        in: ["body"],
        exists: {
            errorMessage: "Password is required!",
            options: { checkFalsy: true },
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be at least 8 characters long",
        },
    },
});

// Register validation should be similar but add the username field
exports.registerValidation = validateRouteHandler({
    email: {
        in: ["body"],
        exists: {
            errorMessage: "Email is required!",
            options: { checkFalsy: true },
        },
        isEmail: {
            errorMessage: "Please enter a valid email address",
        },
    },
    password: {
        in: ["body"],
        exists: {
            errorMessage: "Password is required!",
            options: { checkFalsy: true },
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be at least 8 characters long",
        },
    },
    userName: {
        in: ["body"],
        exists: {
            errorMessage: "Username is required!",
            options: { checkFalsy: true },
        },
        isLength: {
            options: { min: 3 },
            errorMessage: "Username must be at least 3 characters long",
        },
    },
});
