import { Router } from "express";
import { addToCart } from "../controller/cartController.js";
import verifyToken from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/add-to-cart").post(verifyToken ,addToCart);

export default router;