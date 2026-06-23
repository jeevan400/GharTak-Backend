import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema({
    conversation:{
        type: Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    read:{
        type: Boolean,
        default: false
    }
},
{
    timestamps:true
}
);

const Message = mongoose.model("Message", messageSchema);

export { Message };