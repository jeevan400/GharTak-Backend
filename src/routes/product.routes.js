import { Router } from "express";
import { addProduct, deleteProduct, getMyProduct, updateProduct } from "../controller/product.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isSeller from "../middlewares/seller.middleware.js";

const router = Router();

router.route("/add-product").post(verifyToken, isSeller, addProduct);
router.route("/my-product").get(verifyToken, isSeller, getMyProduct);
router.route("/edit-product/:id").patch(verifyToken, isSeller, updateProduct);
router.route("/delete-product/:id").delete(verifyToken, isSeller, deleteProduct);
export default router;