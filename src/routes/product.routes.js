import { Router } from "express";
import {
  addProduct,
  addReviewForProfuct,
  blockProduct,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllReviews,
  getMyProduct,
  getSingleProduct,
  updateProduct,
  updateReview,
} from "../controller/product.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isSeller from "../middlewares/seller.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import allowAdminSeller from "../middlewares/admin_seller.middleware.js";

const router = Router();

router.route("/add-product").post(verifyToken, isSeller, addProduct);
router.route("/my-product").get(verifyToken, isSeller, getMyProduct);
router
  .route("/edit-product/:id")
  .patch(verifyToken, allowAdminSeller, updateProduct);
router
  .route("/delete-product/:id")
  .delete(verifyToken, isSeller, deleteProduct);
router.route("/all-products").get(getAllProducts);
router.route("/single-product/:id").get(getSingleProduct);
router.route("/:productId/review").post(verifyToken, addReviewForProfuct);
router.route("/:productId/all-reviews").get(verifyToken, getAllReviews);
router.route("/:productId/review/:reviewId").delete(verifyToken, deleteReview);
router.route("/:productId/review/:reviewId").patch(verifyToken, updateReview);
router
  .route("/diactivate-product/:productId")
  .patch(verifyToken, isAdmin, blockProduct);

export default router;
