import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity:{
    type:Number,
    required:true,
    default:1,
    min:1,
  },
  price:{
    type:Number,
    required:true,
    min:0,
  }
}, {_id:false});


const cartSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    items:[cartItemSchema],
    totalPrice:{
        type:Number,
        default:0
    },
    totalItems:{
        type:Number,
        default:0
    }
}, {timestamps:true});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
