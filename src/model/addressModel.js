import mongoose from "mongoose";
import { Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fullname:{
        type:String
    },
    phone:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    pincode:{
        type:String
    },
    country:{
        type:String
    },
    address:{
        type:String
    }
});

const Address = mongoose.model("Address", addressSchema);

export {Address};