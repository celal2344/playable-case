import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerUser, loginUser, getCurrentUser,
    logoutUser, updatePasword, refreshAccessToken,
    updateAccountDetails, updateUserRole,
    sendOtp, verifyOtp
} from "../controllers/user.controller.js"
import { checkSuperAdminRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(jwtVerify, getCurrentUser);

router.route("/logout").post(jwtVerify, logoutUser);

router.route("/update-password").patch(jwtVerify, updatePasword);

router.route("/update-account-details").patch(jwtVerify, updateAccountDetails);

router.route("/send-otp").post(sendOtp);

router.route("/verify-otp").post(verifyOtp);


// Protected route only superAdmin access this route
router.route("/change-user-role/:userId").patch(jwtVerify, checkSuperAdminRole, updateUserRole);

export {
    router
}
