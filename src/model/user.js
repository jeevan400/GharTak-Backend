import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    isSellerApproved: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
    },
    // TODO: create a new schema for otp and do not store the otp in plain text
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      purpose: {
        type: String,
        enum: ["register", "reset"],
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export { User };
