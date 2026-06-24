import httpStatus from "http-status";
import { ConverSation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";

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

        return res.status(httpStatus.OK).json({ success: true, messages });
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