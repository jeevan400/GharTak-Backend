import httpStatus from "http-status";
import { ConverSation } from "../model/conversationModel.js";

const createConversation = async (req, res) =>{
    try{
        const existingConversation = await ConverSation.findOne({
            participants:{
                $all : [req.user.id, req.params.sellerId]
            }
        });

        if(req.user.id === req.params.sellerId){
            return res.status(httpStatus.BAD_REQUEST).json({message:"You connot chat with your self."});
        }
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

        res.status(httpStatus.OK).json(conversation);
    } catch(e){
        res.status(httpstatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export {createConversation, getConverSation};