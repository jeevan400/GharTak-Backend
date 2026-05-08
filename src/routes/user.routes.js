import { Router } from "express";
import { register, login, sendOTP, verifyOTP, sendForgotPassOTP, verifyForgotPassOTP, resetPassword, googleLogin, getProfile, updateProfile, requestSellerRole, getSellerRequest, approveSellerRequest, rejectSellerRequest } from "../controller/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/forgot-password").post(sendForgotPassOTP);
router.route("/verify-forgototp").post(verifyForgotPassOTP);
router.route("/reset-password").post(resetPassword);
router.route("/google-login").post(googleLogin);
router.route("/profile").get(verifyToken, getProfile);
router.route("/profile").patch(verifyToken, updateProfile);
router.route("/request-seller").patch(verifyToken, requestSellerRole);
router.route("/seller-requests").get(verifyToken, isAdmin, getSellerRequest);
router.route("/approve-request/:id").patch(verifyToken, isAdmin, approveSellerRequest);
router.route("/reject-request/:id").patch(verifyToken, isAdmin, rejectSellerRequest);


export default router;