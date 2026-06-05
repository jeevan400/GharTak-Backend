import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createNotification, getNotification } from "../controller/notification.controller.js";

const router = Router();

router.route("/send-notification").post(verifyToken, createNotification);
router.route("/get-notifications").get(verifyToken, getNotification);
// router.route("/read-notifications").get(verifyToken, readNotification);

export default router;