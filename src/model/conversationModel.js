import mongoose from "mongoose";
import { Schema } from "mongoose";

const converSationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageRead:{
      type:Boolean,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const ConverSation = mongoose.model("ConverSation", converSationSchema);

export { ConverSation };
