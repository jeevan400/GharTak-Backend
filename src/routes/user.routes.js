import { Router } from "express";
import { register, login, sendOTP, verifyOTP, sendForgetPassOTP, verifyForgetPassOTP, resetPassword } from "../controller/user.controller.js";

const router = Router();

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/forget-password").post(sendForgetPassOTP);
router.route("/verify-forgetotp").post(verifyForgetPassOTP);
router.route("/reset-password").post(resetPassword);


export default router;