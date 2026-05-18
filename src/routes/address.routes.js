import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { addUserAddress, deleteAddress, getUserAddress, updateUserAddress } from "../controller/addressController.js";

const router = Router();

router.route("/add-address").post(verifyToken, addUserAddress);
router.route("/address").get(verifyToken, getUserAddress);
router.route("/delete-address/:id").delete(verifyToken, deleteAddress);
router.route("/update-address/:id").patch(verifyToken, updateUserAddress );

export default router;