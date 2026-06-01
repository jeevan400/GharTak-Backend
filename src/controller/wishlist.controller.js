import httpStatus from "http-status";
import { WishList } from "../model/wishlist.Model.js";
import { Cart } from "../model/cartModel.js";

const addWishList = async (req, res) => {
  try {
    const wishList = await WishList.findOne({ user: req.user.id });

    //create wishlist first time
    if (!wishList) {
      const newWishList = await WishList.create({
        user: req.user.id,
        products: [req.params.productId],
      });

      return res.status(httpStatus.OK).json({
        message: "Product added on wishlist.",
        wishlist: newWishList,
        isWishList: true
      });
    }

    // if (wishList.products.includes(req.params.productId)) {
    //   return res
    //     .status(httpStatus.FOUND)
    //     .json({ message: "Product already added in the wishlist." });
    // }


    // check product exists
    const exists = wishList.products.some((product) => product.toString() === req.params.productId);

    //remove product 
    if(exists){
      wishList.products = wishList.products.filter((product) => product.toString() !== req.params.productId);

      await wishList.save();

      return res.status(httpStatus.OK).json({message:"Product removed from wishlist.", isWishList: false});
    }

    wishList.products.push(req.params.productId);
    await wishList.save();
    res.status(httpStatus.OK).json({ message: "Product added on wishlist.", isWishList: true });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};


//get wishtList of single product 
const getSingleWishList = async ( req, res) => {
  try{

    const wishList = await WishList.findOne({user: req.user.id}).populate("products");

    if(!wishList){
      return res.status(httpStatus.OK).json({products:[]});
    }


    res.status(httpStatus.OK).json({products: wishList.products});

  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}



export { addWishList, getSingleWishList };