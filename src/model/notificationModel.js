import mongoose from "mongoose";
import { Schema } from "mongoose";

const notificationSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sender:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  type: {
    type:String,
    enum:["review", "cart", "order", "wishlist"]
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
