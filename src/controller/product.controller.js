import { Cart } from "../model/cartModel.js";
import { Notification } from "../model/notificationModel.js";
import { Product } from "../model/product.js";
import httpStatus from "http-status";
import { getIO } from "./socketManager.js";
import { User } from "../model/user.js";

// add product api
const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user.id,
    });

    res
      .status(httpStatus.OK)
      .json({ message: "Product added successfully.", product });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

//get my products api
const getMyProduct = async (req, res) => {
  try {
    // console.log("this is request object ", req);
    const products = await Product.find({ seller: req.user.id });

    if (!products) {
      return res.status(400).json({ message: "product is not found" });
    }

    res.status(httpStatus.OK).json(products);
    // console.log("this is a my products ", products);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// update product api
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id).select("-password");

    if(!user){
      return res.status(httpStatus.NOT_FOUND).json({message:"User not found!"});
    }

    if (!product) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Product not found." });
    }

    // seller ownership check or admin allowed
    if (product.seller.toString() !== req.user.id && user.role !== "admin") {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not authorized to update this product" });
    }

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    ).select("-seller");

    res
      .status(httpStatus.OK)
      .json({ message: "Product Updated successfully!" });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// delete product api
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Product not found." });
    }

    if (product.seller.toString() !== req.user.id) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not authorized to delete this product." });
    }

    await product.deleteOne();

    res.status(httpStatus.OK).json({ message: "Product delete successfully." });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

//get all products
const getAllProducts = async (req, res) => {
  try {

    // search query
    const search = req.query.search || "";

    // current page 
    const page = Number(req.query.page) || 1;

    // limit of products 
    const limit = Number(req.query.limit) || 10;

    // calculate the skip products 
    const skip = (page -1 ) * limit;

    let query = {};

    if(search){
      query.name = {
        $regex: search,
        $options: "i"
      };
    }

    let filter = { ...query };

    if(req.user?.role === "user"){
      filter.isActive = true;
    }

    console.log("this is user: ", req.user);
    const products = await Product.find(filter).skip(skip).limit(limit);

    if (products.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Product Not Found." });
    }

    // count total products
    const totalProducts = await Product.countDocuments(query);

    // calculate total pages 
    const totalPages = Math.ceil(totalProducts/ limit);

    res.status(httpStatus.OK).json({ products,
      currentPage: page,
      totalProducts,
      totalPages,
    });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

//get single product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Bad request" });
    }

    res.status(httpStatus.OK).json(product);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// create reviews
const addReviewForProfuct = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString(),
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product." });
    }

    const review = {
      user: req.user.id,
      rating,
      comment,
    };

    product.reviews.push(review);

    await product.save();

    const newNotification = await Notification.create({
      receiver: product.seller,
      sender: req.user.id,
      type: "review",
      title:"Reviewed",
      message: `${req.user.id} reviewed your product`
    });

    const io = getIO();
    const sellerRoom = product.seller.toString();
    const room = io.sockets.adapter.rooms.get(sellerRoom);
    
    io.to(sellerRoom).emit("newNotification", newNotification);
    res.status(httpStatus.OK).json({ message: "Review added successfully!" });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// get all reviews
const getAllReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "reviews.user",
      "-password",
    );

    if (!product) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Product not found." });
    }

    const reviews = product.reviews;

    res.status(httpStatus.OK).json(reviews);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// delete review
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Product not found." });
    }

    const review = product.reviews.find(
      (review) => review._id.toString() === req.params.reviewId.toString(),
    );

    if (!review) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Review not found." });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "You are not authorized User." });
    }

    product.reviews = product.reviews?.filter(
      (review) => review._id.toString() !== req.params.reviewId,
    );

    await product.save();

    res.status(httpStatus.OK).json({ message: "Review Deleted" });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

const updateReview = async (req, res) =>{
  try{

    const {rating, comment } = req.body;

    const product = await Product.findById(req.params.productId);

    if(!product) {
       return res.status(httpStatus.NOT_FOUND).json({message:"Product not found."});
    }

    const review = product.reviews.find((review)=> review._id.toString() === req.params.reviewId.toString());

    if(!review) {
      return res.status(httpStatus.NOT_FOUND).json({message:"Review not found."});
    }

    if(review.user.toString() !== req.user.id.toString()){
      return res.status(httpStatus.UNAUTHORIZED).json({message:"You are not a authorized User."});
    }

    review.rating = rating;
    review.comment = comment;

    await product.save();

    res.status(httpStatus.OK).json({message:"Review updated successfully"});

  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}

const blockProduct = async (req, res) =>{
  try{
      const product = await Product.findById(req.params.productId);

      if(!product){
        return res.status(httpStatus.NOT_FOUND).json({message:"Product not found."});
      }

      product.isActive = !product.isActive;

      await product.save();

      if(product.isActive){
        const newNotification = await Notification.create({
      receiver: product.seller,
      sender: req.user.id,
      type: "review",
      title:"Block Product",
      message: `admin block your product`
    });

    const io = getIO();
    const sellerRoom = product.seller.toString();
    const room = io.sockets.adapter.rooms.get(sellerRoom);
    
    io.to(sellerRoom).emit("newNotification", newNotification);
      } else{
        const newNotification = await Notification.create({
      receiver: product.seller,
      sender: req.user.id,
      type: "review",
      title:"Unblock Product",
      message: `Admin unblock your product`
    });

    const io = getIO();
    const sellerRoom = product.seller.toString();
    const room = io.sockets.adapter.rooms.get(sellerRoom);
    
    io.to(sellerRoom).emit("newNotification", newNotification);
      }

      res.status(httpStatus.OK).json({message:"Successfully Change Product Status."});
  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}

export {
  addProduct,
  getMyProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  addReviewForProfuct,
  getAllReviews,
  deleteReview,
  updateReview,
  blockProduct
};
