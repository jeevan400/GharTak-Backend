import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewate.js";
import { updateProfile } from "../controller/upload.controller.js";

const router = Router();

router
  .route("/upload-image")
  .patch(verifyToken, upload.single("image"), updateProfile);

export default router;
