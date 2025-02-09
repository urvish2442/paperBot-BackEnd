import { body, param, query } from "express-validator";

// Create Question Type Validator
const createQuestionTypeValidator = () => [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must be under 100 characters"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 255 })
        .withMessage("Description must be under 255 characters"),
];

// Get All Question Types Validator
const getQuestionTypesValidator = () => [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
];

// Get Question Type by ID Validator
const getQuestionTypeByIdValidator = () => [
    param("id").isMongoId().withMessage("Valid Question Type ID is required"),
];

// Update Question Type Validator
const updateQuestionTypeValidator = () => [
    param("id").isMongoId().withMessage("Valid Question Type ID is required"),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Name must be under 100 characters"),
    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty")
        .isLength({ max: 255 })
        .withMessage("Description must be under 255 characters"),
];

// Delete Question Type Validator
const deleteQuestionTypeValidator = () => [
    param("id").isMongoId().withMessage("Valid Question Type ID is required"),
];

export {
    createQuestionTypeValidator,
    getQuestionTypesValidator,
    getQuestionTypeByIdValidator,
    updateQuestionTypeValidator,
    deleteQuestionTypeValidator,
};
