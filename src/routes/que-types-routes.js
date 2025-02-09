import express from "express";
import {
    createQuestionType,
    getQuestionTypes,
    getQuestionTypeById,
    updateQuestionType,
    deleteQuestionType,
} from "../controllers/question-types-controllers.js";
import {
    createQuestionTypeValidator,
    getQuestionTypesValidator,
    getQuestionTypeByIdValidator,
    updateQuestionTypeValidator,
    deleteQuestionTypeValidator,
} from "../validators/question-types-validators.js";
import { validate } from "../validators/validate.js";
import {
    verifyJWT,
    verifyPermission,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../constants.js";

const router = express.Router();

// Get all Question Types with optional pagination
router.get(
    "/",
    verifyJWT,
    getQuestionTypesValidator(),
    validate,
    getQuestionTypes
);

// Create a new Question Type (ADMIN only)
router.post(
    "/",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    createQuestionTypeValidator(),
    validate,
    createQuestionType
);

// Get a specific Question Type by ID
router.get(
    "/:id",
    verifyJWT,
    getQuestionTypeByIdValidator(),
    validate,
    getQuestionTypeById
);

// Update a specific Question Type by ID (ADMIN only)
router.put(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateQuestionTypeValidator(),
    validate,
    updateQuestionType
);

// Delete a specific Question Type by ID (ADMIN only)
router.delete(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteQuestionTypeValidator(),
    validate,
    deleteQuestionType
);

export default router;
