import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createConversation, getConverSation } from "../controller/conversationController.js";

const router = Router();

router.route("/message-room/:sellerId").post(verifyToken, createConversation);
router.route("/all-conversations").get(verifyToken, getConverSation);

export default router;