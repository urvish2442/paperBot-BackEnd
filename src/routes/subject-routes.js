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
    addOrUpdateMultipleQuestionTypes,
    getAllConstants,
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
    addMultipleQuestionTypesValidator,
} from "../validators/subject-validators.js";
import { UserRolesEnum } from "../constants.js";

const router = express.Router();
router.get("/", verifyJWT, getAllSubjectsValidator(), validate, getAllSubjects);
// router.get("/filters", verifyJWT, getAllConstants); // get all filters

//** Get All Constants */

router.get("/filters", getAllConstants);

//** Create Subject */

router.post(
    "/",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    createSubjectValidator(),
    validate,
    createSubject
);

//** Get Subject Details */

router.get(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    getSubjectByIdValidator(),
    validate,
    getSubjectById
);

//** Update Subject */

router.put(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    updateSubjectValidator(),
    validate,
    updateSubject
);

//** Delete Subject */

router.delete(
    "/:id",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteSubjectValidator(),
    validate,
    deleteSubject
);

//** Add School to Subject */

router.post(
    "/:id/schools",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    addSchoolToSubjectValidator(),
    validate,
    addSchoolToSubject
);

//** Remove School from Subject */

router.delete(
    "/:id/schools",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    removeSchoolFromSubjectValidator(),
    validate,
    removeSchoolFromSubject
);

//** Toggle Subject Status */

router.patch(
    "/:id/status",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    toggleSubjectStatusValidator(),
    validate,
    toggleSubjectStatus
);

//** Add Multiple Units */

router.post(
    "/:id/units",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    addMultipleUnitsValidator(),
    validate,
    addMultipleUnits
);

//** Add Multiple Question Types */

router.post(
    "/:id/question-types",
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    addMultipleQuestionTypesValidator(),
    validate,
    addOrUpdateMultipleQuestionTypes
);

export default router;
