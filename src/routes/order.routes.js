import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { cancelOrder, getAllOrders, getMyOrder, orderCreate, todaysOrders, updateOrderStatus } from "../controller/orderController.js";
import isSeller from "../middlewares/seller.middleware.js";
import { getSellerOrder } from "../controller/sellerOrderController.js";
import isAdmin from "../middlewares/admin.middleware.js";
import allowAdminSeller from "../middlewares/admin_seller.middleware.js";

const router = Router();

router.route("/order").post(verifyToken, orderCreate);
router.route("/my-order").get(verifyToken, getMyOrder);
router.route("/seller-orders").get(verifyToken, isSeller, getSellerOrder);
router.route("/update-order-status/:orderId").patch(verifyToken, allowAdminSeller, updateOrderStatus);
router.route("/all-orders").get(verifyToken, isAdmin, getAllOrders);
router.route("/cancel-order/:id").patch(verifyToken, cancelOrder);
router.route("/today-revenue").get(verifyToken, isAdmin, todaysOrders);

export default router;