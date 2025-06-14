import { Router } from "express";
import { UserRolesEnum } from "../constants.js";
import {
    assignRole,
    changeCurrentPassword,
    forgotPasswordRequest,
    getAllUsers,
    getCurrentUser,
    getUserStats,
    handleSocialLogin,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    updateUserAvatar,
    verifyAndLogin,
    verifyEmail,
} from "../controllers/user-controllers.js";
import {
    verifyJWT,
    verifyPermission,
} from "../middlewares/auth.middlewares.js";
import {
    userAssignRoleValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgottenPasswordValidator,
    userVerifyAndLoginValidator,
} from "../validators/user-validators.js";
import { validate } from "../validators/validate.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";

const app = Router();

// Unsecured route
app.route("/register").post(userRegisterValidator(), validate, registerUser);
app.route("/login").post(userLoginValidator(), validate, loginUser);
app.route("/verify-and-login").post(
    userVerifyAndLoginValidator(),
    validate,
    verifyAndLogin
);
app.route("/refresh-token").post(refreshAccessToken);
// app.route("/verify-email/:verificationToken").get(verifyEmail);

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
app.route("/all").get(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    getAllUsers
);
app.route("/stats").get(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    getUserStats
);

export default app;
