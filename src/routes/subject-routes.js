import express from "express";
import {
    verifyJWT,
    verifyPermission,
} from "../middlewares/auth.middlewares.js";
import { validate } from "../validators/validate.js";
import {
    getAllSubjects,
    createSubject,
    getSubjectById,
    updateSubject,
    deleteSubject,
    addSchoolToSubject,
    removeSchoolFromSubject,
    toggleSubjectStatus,
    addMultipleUnits,
} from "../controllers/subjects-controllers.js";
import {
    createSubjectValidator,
    updateSubjectValidator,
    deleteSubjectValidator,
    getSubjectByIdValidator,
    addSchoolToSubjectValidator,
    removeSchoolFromSubjectValidator,
    toggleSubjectStatusValidator,
    getAllSubjectsValidator,
    addMultipleUnitsValidator,
} from "../validators/subject-validators.js";
import { UserRolesEnum } from "../constants.js";

const router = express.Router();

router.get("/", verifyJWT, getAllSubjectsValidator(), validate, getAllSubjects);
router.post(
    "/",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    createSubjectValidator(),
    validate,
    createSubject
);
router.get(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    getSubjectByIdValidator(),
    validate,
    getSubjectById
);
router.put(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateSubjectValidator(),
    validate,
    updateSubject
);
router.delete(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteSubjectValidator(),
    validate,
    deleteSubject
);
router.post(
    "/:id/schools",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    addSchoolToSubjectValidator(),
    validate,
    addSchoolToSubject
);
router.delete(
    "/:id/schools",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    removeSchoolFromSubjectValidator(),
    validate,
    removeSchoolFromSubject
);
router.patch(
    "/:id/status",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    toggleSubjectStatusValidator(),
    validate,
    toggleSubjectStatus
);
router.post(
    "/:id/units",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    addMultipleUnitsValidator(),
    validate,
    addMultipleUnits
);

export default router;
