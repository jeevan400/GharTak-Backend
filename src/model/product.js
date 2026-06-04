import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "electronics",
        "mobiles",
        "laptops",
        "gaming",
        "fashion",
        "mens-clothing",
        "womens-clothing",
        "footwear",
        "watches",
        "beauty",
        "health",
        "home-kitchen",
        "furniture",
        "books",
        "sports",
        "toys",
        "grocery",
        "automotive",
        "jewelry",
        "bags",
      ],
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reviews: [reviewSchema],
    image: [
      {
        type: String,
        required: true,
      },
    ],
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export { Product };
