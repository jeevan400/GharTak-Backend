import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getMyProduct, getSingleProduct, updateProduct } from "../controller/product.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isSeller from "../middlewares/seller.middleware.js";

const router = Router();

router.route("/add-product").post(verifyToken, isSeller, addProduct);
router.route("/my-product").get(verifyToken, isSeller, getMyProduct);
router.route("/edit-product/:id").patch(verifyToken, isSeller, updateProduct);
router.route("/delete-product/:id").delete(verifyToken, isSeller, deleteProduct);
router.route("/all-products").get(getAllProducts);
router.route("/single-product/:id").get(getSingleProduct);
export default router;