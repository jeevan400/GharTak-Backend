import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { getMyOrder, orderCreate } from "../controller/orderController.js";
import isSeller from "../middlewares/seller.middleware.js";
import { getSellerOrder } from "../controller/sellerOrderController.js";

const router = Router();

router.route("/order").post(verifyToken, orderCreate);
router.route("/my-order").get(verifyToken, getMyOrder);
router.route("/seller-orders").get(verifyToken, isSeller, getSellerOrder);

export default router;