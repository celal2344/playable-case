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

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: User registration
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.route("/register").post(registerUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 */
router.route("/login").post(loginUser);

/**
 * @openapi
 * /user/refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.route("/refresh-token").post(refreshAccessToken);

/**
 * @openapi
 * /user/current-user:
 *   get:
 *     summary: Get current user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 */
router.route("/current-user").get(jwtVerify, getCurrentUser);

/**
 * @openapi
 * /user/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.route("/logout").post(jwtVerify, logoutUser);

/**
 * @openapi
 * /user/update-password:
 *   patch:
 *     summary: Update password
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.route("/update-password").patch(jwtVerify, updatePasword);

/**
 * @openapi
 * /user/update-account-details:
 *   patch:
 *     summary: Update account details
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Details updated
 */
router.route("/update-account-details").patch(jwtVerify, updateAccountDetails);

/**
 * @openapi
 * /user/send-otp:
 *   post:
 *     summary: Send OTP
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.route("/send-otp").post(sendOtp);

/**
 * @openapi
 * /user/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.route("/verify-otp").post(verifyOtp);

/**
 * @openapi
 * /user/change-user-role/{userId}:
 *   patch:
 *     summary: Change user role (super admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role changed
 */
// Protected route only superAdmin access this route
router.route("/change-user-role/:userId").patch(jwtVerify, checkSuperAdminRole, updateUserRole);

export {
    router
}
