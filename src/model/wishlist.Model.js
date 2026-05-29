import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    products:[
        {
            type:Schema.Types.ObjectId,
            ref:"Product",
        }
    ]
});

const WishList = mongoose.model("WishList", wishlistSchema);

export {WishList};