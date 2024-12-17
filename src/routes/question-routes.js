import express from "express";
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    toggleQuestionStatus,
} from "../controllers/questions-controllers.js";
import {
    createQuestionValidator,
    updateQuestionValidator,
    getQuestionByIdValidator,
    deleteQuestionValidator,
} from "../validators/question-validators.js";
import {
    verifyJWT,
    verifyPermission,
} from "../middlewares/auth.middlewares.js";
import { validate } from "../validators/validate.js";
import { UserRolesEnum } from "../constants.js";

const router = express.Router();

router.get(
    "/:modelName",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    validate,
    getQuestions
); // Get all questions

router.post(
    "/:modelName",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    createQuestionValidator(),
    validate,
    createQuestion
); // Create a question

router.get(
    "/:modelName/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    getQuestionByIdValidator(),
    validate,
    getQuestionById
); // Get question by ID

router.put(
    "/:modelName/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateQuestionValidator(),
    validate,
    updateQuestion
); // Update question by ID

router.delete(
    "/:modelName/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteQuestionValidator(),
    validate,
    deleteQuestion
); // Delete question by ID

router.patch(
    "/:modelName/:id/active",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    getQuestionByIdValidator(),
    validate,
    toggleQuestionStatus
);

export default router;
