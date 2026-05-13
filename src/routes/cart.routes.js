import { Router } from "express";
import { addToCart, getCartItems, updateCartQuantity } from "../controller/cartController.js";
import verifyToken from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/add-to-cart").post(verifyToken ,addToCart);
router.route("/get-cart").get(verifyToken, getCartItems);
router.route("/update-quantity/:productId").patch(verifyToken, updateCartQuantity);

export default router;