import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { addWishList, getSingleWishList } from "../controller/wishlist.controller.js";

const router = Router();

router.route("/add-wishlist/:productId").post(verifyToken, addWishList);
router.route("/single-wishlist").get(verifyToken, getSingleWishList);

export default router;