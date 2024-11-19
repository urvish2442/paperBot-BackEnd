import { body, param, query } from "express-validator";
import { AvailableQuestionTypes } from "../constants.js";

const createQuestionValidator = () => {
    return [
        body("type")
            .trim()
            .notEmpty()
            .withMessage("Question type is required")
            .isIn(AvailableQuestionTypes)
            .withMessage("Invalid question type"),
        body("unit").trim().notEmpty().withMessage("Unit is required"),
        body("question").trim().notEmpty().withMessage("Question is required"),
        body("answer").trim().notEmpty().withMessage("Answer is required"),
        body("queDetails")
            .trim()
            .notEmpty()
            .withMessage("Question details are required"),
        body("marks")
            .notEmpty()
            .withMessage("Marks are required")
            .isNumeric()
            .withMessage("Marks must be a numeric value"),
        body("isFormatted")
            .optional()
            .isBoolean()
            .withMessage("isFormatted must be a boolean"),
        body("created_by")
            .trim()
            .notEmpty()
            .withMessage("Created by is required"),
        body("isActive")
            .optional()
            .isBoolean()
            .withMessage("isActive must be a boolean"),
        body("isVerified")
            .optional()
            .isBoolean()
            .withMessage("isVerified must be a boolean"),
    ];
};

const updateQuestionValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid question ID"),
        body("type")
            .optional()
            .isIn(AvailableQuestionTypes)
            .withMessage("Invalid question type"),
        body("unit").optional().isString().withMessage("Unit must be a string"),
        body("question")
            .optional()
            .isString()
            .withMessage("Question must be a string"),
        body("answer")
            .optional()
            .isString()
            .withMessage("Answer must be a string"),
        body("queDetails")
            .optional()
            .isString()
            .withMessage("Question details must be a string"),
        body("marks")
            .optional()
            .isNumeric()
            .withMessage("Marks must be a numeric value"),
        body("isFormatted")
            .optional()
            .isBoolean()
            .withMessage("isFormatted must be a boolean"),
        body("isActive")
            .optional()
            .isBoolean()
            .withMessage("isActive must be a boolean"),
        body("isVerified")
            .optional()
            .isBoolean()
            .withMessage("isVerified must be a boolean"),
    ];
};

const getQuestionByIdValidator = () => {
    return [param("id").isMongoId().withMessage("Invalid question ID")];
};

const deleteQuestionValidator = () => {
    return [param("id").isMongoId().withMessage("Invalid question ID")];
};

export {
    createQuestionValidator,
    updateQuestionValidator,
    getQuestionByIdValidator,
    deleteQuestionValidator,
};
