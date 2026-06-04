import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createNotification } from "../controller/notification.controller.js";

const router = Router();

router.route("/send-notification").post(verifyToken, createNotification);

export default router;