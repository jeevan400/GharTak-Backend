import { Router } from "express";
import { register, login, sendOTP, verifyOTP, sendForgotPassOTP, verifyForgotPassOTP, resetPassword, googleLogin } from "../controller/user.controller.js";

const router = Router();

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/forgot-password").post(sendForgotPassOTP);
router.route("/verify-forgototp").post(verifyForgotPassOTP);
router.route("/reset-password").post(resetPassword);
router.route("/google-login").post(googleLogin);


export default router;