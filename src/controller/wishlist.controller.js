import httpStatus from "http-status";
import { WishList } from "../model/wishlist.Model.js";
import { Cart } from "../model/cartModel.js";
import { getIO } from "./socketManager.js";
import { Notification } from "../model/notificationModel.js";

const addWishList = async (req, res) => {
  try {
    const wishList = await WishList.findOne({ user: req.user.id })
      .populate("user", "-password")
      .populate({
        path: "products",
        populate: {
          path: "seller",
          select: "_id",
        },
      });

    //create wishlist first time
    if (!wishList) {
      const newWishList = await WishList.create({
        user: req.user.id,
        products: [req.params.productId],
      });

      return res.status(httpStatus.OK).json({
        message: "Product added on wishlist.",
        wishlist: newWishList,
        isWishList: true,
      });
    }

    // check product exists
    const exists = wishList.products.some((product) => {
      const productId = product._id
        ? product._id.toString()
        : product.toString();
      return productId === req.params.productId;
    });

    // remove product
    if (exists) {
      wishList.products = wishList.products.filter((product) => {
        const productId = product._id
          ? product._id.toString()
          : product.toString();
        return productId !== req.params.productId;
      });

      await wishList.save();

      return res
        .status(httpStatus.OK)
        .json({ message: "Product removed from wishlist.", isWishList: false });
    }

    wishList.products.push(req.params.productId);
    await wishList.save();

    // again populate wishlist because wishlist save then mongodb refresh all things then again i need to populate this 
    await wishList.populate({
      path: "products",
      populate: {
        path: "seller",
        select: "_id",
      },
    });

    // send notification
    for (let i = 0; i < wishList.products.length; i++) {
      if(req.params.productId.toString() === wishList.products[i]._id.toString()){
      console.log("this is product : ", wishList.products[i]);
      const newNotification = await Notification.create({
          receiver: wishList.products[i].seller._id.toString(),
          sender: req.user.id,
          type: "review",
          title:"Add to WishList",
          message: `jeevan added your product in wishList.`
        });

        const io = getIO();
        const sellerRoom = wishList.products[i].seller._id.toString();
        const room = io.sockets.adapter.rooms.get(sellerRoom);

        io.to(sellerRoom).emit("newNotification", newNotification);
        }
    }

    res
      .status(httpStatus.OK)
      .json({ message: "Product added on wishlist.", isWishList: true });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

//get wishtList of single product
const getSingleWishList = async (req, res) => {
  try {
    const wishList = await WishList.findOne({ user: req.user.id }).populate(
      "products",
    );

    if (!wishList) {
      return res.status(httpStatus.OK).json({ products: [] });
    }

    res.status(httpStatus.OK).json({ products: wishList.products });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

export { addWishList, getSingleWishList };
