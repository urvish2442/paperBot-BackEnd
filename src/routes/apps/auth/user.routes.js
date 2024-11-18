import { Router } from "express";
import { UserRolesEnum } from "../../../constants.js";
import {
    assignRole,
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    handleSocialLogin,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    updateUserAvatar,
    verifyEmail,
} from "../../../controllers/apps/auth/user.controllers.js";
import {
    verifyJWT,
    verifyPermission,
} from "../../../middlewares/auth.middlewares.js";
import {
    userAssignRoleValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgottenPasswordValidator,
} from "../../../validators/apps/auth/user.validators.js";
import { validate } from "../../../validators/validate.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const app = Router();

// Unsecured route
app.route("/register").post(userRegisterValidator(), validate, registerUser);
app.route("/login").post(userLoginValidator(), validate, loginUser);
app.route("/refresh-token").post(refreshAccessToken);
app.route("/verify-email/:verificationToken").get(verifyEmail);

app.route("/forgot-password").post(
    userForgotPasswordValidator(),
    validate,
    forgotPasswordRequest
);
app.route("/reset-password/:resetToken").post(
    userResetForgottenPasswordValidator(),
    validate,
    resetForgottenPassword
);

// Secured routes
app.route("/logout").post(verifyJWT, logoutUser);
app.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);
app.route("/current-user").get(verifyJWT, getCurrentUser);
app.route("/change-password").post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword
);
app.route("/resend-email-verification").post(
    verifyJWT,
    resendEmailVerification
);
app.route("/assign-role/:userId").post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("userId"),
    userAssignRoleValidator(),
    validate,
    assignRole
);

export default app;
