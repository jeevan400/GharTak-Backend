import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createMessage, getAllconversationMessages, messageDelete } from "../controller/messageController.js";

const router = Router();

router.route("/send-message/:conversationId").post(verifyToken, createMessage);
router.route("/get-all-messages/:conversationId").get(verifyToken, getAllconversationMessages);
router.route("/delete-messages/:messageId").delete(verifyToken, messageDelete);

export default router;