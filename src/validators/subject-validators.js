import { body, param, query } from "express-validator";
import {
    AvailableBoards,
    AvailableMediums,
    AvailableStandards,
    AvailableSubjects,
} from "../constants.js";

const createSubjectValidator = () => {
    return [
        body("board")
            .trim()
            .notEmpty()
            .withMessage("Board is required")
            .isIn(AvailableBoards)
            .withMessage("Invalid board"),
        body("standard")
            .trim()
            .notEmpty()
            .withMessage("Standard is required")
            .isIn(AvailableStandards)
            .withMessage("Invalid standard"),
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Subject name is required")
            .isIn(AvailableSubjects)
            .withMessage("Invalid subject name"),
        body("medium")
            .trim()
            .notEmpty()
            .withMessage("Medium is required")
            .isIn(AvailableMediums)
            .withMessage("Invalid medium"),
        body("code").trim().notEmpty().withMessage("Code is required"),
        body("price")
            .optional()
            .isNumeric()
            .withMessage("Price must be a number"),
        body("isSequenceRequired")
            .isBoolean()
            .withMessage("isSequenceRequired must be a boolean"),
    ];
};

const updateSubjectValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid subject ID"),
        body("board")
            .optional()
            .isIn(AvailableBoards)
            .withMessage("Invalid board"),
        body("standard")
            .optional()
            .isIn(AvailableStandards)
            .withMessage("Invalid standard"),
        body("name")
            .optional()
            .isIn(AvailableSubjects)
            .withMessage("Invalid subject name"),
        body("medium")
            .optional()
            .isIn(AvailableMediums)
            .withMessage("Invalid medium"),
        body("code").optional().isString().withMessage("Code must be a string"),
        body("price")
            .optional()
            .isNumeric()
            .withMessage("Price must be a number"),
        body("isSequenceRequired")
            .isBoolean()
            .withMessage("isSequenceRequired must be a boolean"),
    ];
};

const deleteSubjectValidator = () => {
    return [param("id").isMongoId().withMessage("Invalid subject ID")];
};

const getSubjectByIdValidator = () => {
    return [param("id").isMongoId().withMessage("Invalid subject ID")];
};

const addSchoolToSubjectValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid subject ID"),
        body("schoolId")
            .notEmpty()
            .withMessage("School ID is required")
            .isMongoId()
            .withMessage("Invalid school ID"),
    ];
};

const removeSchoolFromSubjectValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid subject ID"),
        body("schoolId")
            .notEmpty()
            .withMessage("School ID is required")
            .isMongoId()
            .withMessage("Invalid school ID"),
    ];
};

const toggleSubjectStatusValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid subject ID"),
        body("isActive")
            .notEmpty()
            .withMessage("isActive is required")
            .isBoolean()
            .withMessage("isActive must be a boolean"),
    ];
};

const getAllSubjectsValidator = () => {
    return [
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be a positive integer"),
        query("limit")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Limit must be a positive integer"),
    ];
};

const addMultipleUnitsValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid subject ID"),
        body("units")
            .isArray({ min: 1 })
            .withMessage("Units must be a non-empty array"),
        body("units.*.number")
            .notEmpty()
            .withMessage("Unit number is required")
            .isInt({ min: 1 })
            .withMessage("Unit number must be a positive integer"),
        body("units.*.name")
            .notEmpty()
            .withMessage("Unit name is required")
            .isString()
            .withMessage("Unit name must be a string"),
        body("units.*.isActive")
            .isBoolean()
            .withMessage("isActive must be a boolean"),
    ];
};

const addMultipleQuestionTypesValidator = () => {
    return [
        param("id").isMongoId().withMessage("Invalid subject ID"),
        body("questionTypes")
            .isArray({ min: 1 })
            .withMessage("questionTypes must be a non-empty array"),
        body("questionTypes.*.name")
            .notEmpty()
            .withMessage("Question type name is required")
            .isString()
            .withMessage("Question type name must be a string"),
        body("questionTypes.*.description")
            .notEmpty()
            .withMessage("Question type description is required")
            .isString()
            .withMessage("Question type description must be a string"),
    ];
};
export {
    createSubjectValidator,
    updateSubjectValidator,
    deleteSubjectValidator,
    getSubjectByIdValidator,
    addSchoolToSubjectValidator,
    removeSchoolFromSubjectValidator,
    toggleSubjectStatusValidator,
    getAllSubjectsValidator,
    addMultipleUnitsValidator,
    addMultipleQuestionTypesValidator,
};
