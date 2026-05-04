import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        enum: ["electronics", "fashion", "grocery", "home"],
    required: true
    },
    brand:{
        type:String,
        trim:true
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    image:[{
        type:String,
        required:true
    }],
    isActive:{
        type:Boolean,
        default:true
    }
}, {timestamps:true});


const Product = mongoose.model("Product", productSchema);

export {Product};