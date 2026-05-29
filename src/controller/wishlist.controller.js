import httpStatus from "http-status";
import { WishList } from "../model/wishlist.Model.js";

const addWishList = async (req, res) => {
  try {
    const wishList = await WishList.findOne({ user: req.user.id });

    if (!wishList) {
      const newWishList = await WishList.create({
        user: req.user.id,
        products: [req.params.productId],
      });
      return res.status(httpStatus.OK).json({
        message: "Product added on wishlist.",
        wishlist: newWishList,
      });
    }

    if (wishList.products.includes(req.params.productId)) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "Product already added in the wishlist." });
    }

    wishList.products.push(req.params.productId);
    await wishList.save();
    res.status(httpStatus.OK).json({ message: "Product added on wishlist." });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

export { addWishList };