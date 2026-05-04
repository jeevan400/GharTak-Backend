import { Router } from "express";
import { register, login, sendOTP, verifyOTP } from "../controller/user.controller.js";

const router = Router();

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(login);
router.route("/register").post(register);


export default router;