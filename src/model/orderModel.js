import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required: true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
}, {_id:false});

const orderSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[orderItemSchema],
    shippingAddress:{
        fullname:{
            type:String,
        },
        phone:{
            type:String,
        },
        address:{
            type:String,
        },
        city:{
            type:String,
        },
        state:{
            type:String,
        },
        pincode:{
            type:String,
        },
        country:{
            type:String,
        }
    },
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        default:"COD"
    },
    paymentStatus:{
        type:String,
        enum:["Pending", "Paid"],
        default:"Pending"
    },
    orderStatus:{
        type:String,
        enum:["Processing", "Shipped", "Delivered"],
        default:"Processing"
    },

}, {timestamps:true});

const Order = mongoose.model("Order", orderSchema);

export { Order };