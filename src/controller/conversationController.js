import httpStatus from "http-status";
import { ConverSation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";

const createConversation = async (req, res) =>{
    try{
        if(req.user.id === req.params.sellerId){
            return res.status(httpStatus.BAD_REQUEST).json({message:"You connot chat with your self."});
        }
        
        const existingConversation = await ConverSation.findOne({
            participants:{
                $all : [req.user.id, req.params.sellerId]
            }
        });

        if(existingConversation) {
           return res.status(httpStatus.OK).json(existingConversation);
        } else{
            const conversation = await ConverSation.create({
                participants:[
                    req.user.id,
                    req.params.sellerId
                ]
            });

            return res.status(httpStatus.CREATED).json(conversation);
        }

    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

const getConverSation = async (req, res) => {
    try{
        const conversation = await ConverSation.find({
            participants:{
                $in : [req.user.id]
            }
        }).populate("participants").select("-password");

        if(!conversation){
            return res.status(httpStatus.NOT_FOUND).json({message:"No conversation"});
        }

        const conversationsWithUnreadCount = await Promise.all(
            conversation.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversation: conv._id,
                    sender: { $ne: req.user.id },
                    read: false
                });
                
                const lastMsgObj = await Message.findOne({
                    conversation: conv._id
                }).sort({ createdAt: -1 });

                return { ...conv.toObject(), unreadCount, lastMsgObj };
            })
        );

        res.status(httpStatus.OK).json(conversationsWithUnreadCount);
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export {createConversation, getConverSation};