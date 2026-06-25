import httpStatus from "http-status";
import { ConverSation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";
import { getIO } from "./socketManager.js";

const createMessage = async (req, res) => {
    try {
        const conversation = await ConverSation.findById(req.params.conversationId);

        if (!conversation) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "conversation not found." });
        }

        const { text } = req.body;
        const message = await Message.create({
            conversation: req.params.conversationId,
            sender: req.user.id,
            text: text
        });

        await ConverSation.findByIdAndUpdate(req.params.conversationId, {
            lastMessage: text,
            // lastMessageRead:message.read,
            lastMessageAt: new Date,
        });

        const populatedMessage = await Message.findById(message._id).populate("sender", "name image role email");
        // send message using socket 
        const io = getIO();
        io.to(req.params.conversationId).emit("receiveMessage", populatedMessage);

        res.status(httpStatus.CREATED).json({ success: true, message });
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

const getAllconversationMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversation: req.params.conversationId }).populate({
            path: "sender",
            select: "name email role"
        });

        if (!messages) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "messages not found." });
        }

        // Mark unread messages as read
        await Message.updateMany({
            conversation: req.params.conversationId,
            sender: { $ne: req.user.id },
            read: false
        }, {
            $set: { read: true }
        });

        const unReadMessageCount = 0;

        return res.status(httpStatus.OK).json({ success: true, messages, unReadMessageCount });
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

const messageDelete = async (req, res) => {
    try{

        const message = await Message.findById(req.params.messageId);

        if(!message) {
            return res.status(httpStatus.NOT_FOUND).json({message:"message not found"})
        }

        if(req.user.id.toString() !== message.sender.toString()){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"You are not Authorized User"});
        }

        const deleteMessage = await Message.findByIdAndDelete(req.params.messageId);

        res.status(httpStatus.OK).json({message:"Message Delete successfully.", deleteMessage});

    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}
export { createMessage, getAllconversationMessages, messageDelete };