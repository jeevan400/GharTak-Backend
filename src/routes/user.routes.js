import { Router } from "express";
import { register, login, sendOTP, verifyOTP, sendForgotPassOTP, verifyForgotPassOTP, resetPassword, googleLogin, getProfile, updateProfile } from "../controller/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

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


export default router;