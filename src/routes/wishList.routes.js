import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { addWishList } from "../controller/wishlist.controller.js";

const router = Router();

router.route("/add-wishlist/:productId").post(verifyToken, addWishList);

export default router;