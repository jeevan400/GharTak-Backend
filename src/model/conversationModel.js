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
  },
  { timestamps: true },
);

const ConverSation = mongoose.model("ConverSation", converSationSchema);

export { ConverSation };
