import httpStatus from "http-status";
import { Notification } from "../model/notificationModel.js";

const createNotification = async (req, res) => {
    try{
        const notifications = await Notification.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(httpStatus.CREATED).json({message:"notification send!", success: true, notifications});
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message, success:false});
    }
}


const getNotification = async (req, res) => {
    try{
        const allNotifications = await Notification.find({receiver:req.user.id}).sort({createdAt: -1});

        if(!allNotifications){
            return res.status(httpStatus.NOT_FOUND).json({message:"Empty Notification"});
        }

        res.status(httpStatus.OK).json({allNotifications});
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message})
    }
}

// const readNotification = async (req, res) => {
//     try{
//         const notifications = await Notification.find({user:req.user.id});

//         if(!notifications){
//             return res.status(httpStatus.NOT_FOUND).json({message:"Notifications not found."});
//         }

//         for(let i=0; i<notifications.length; i++){
//             if(notifications[i].isRead === false){
//                 notifications[i].isRead = true;
//             }
//         }

//         res.status(httpStatus.Ok).json({message:"Read notification."});
//     } catch(e){
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
//     }
// }

export {createNotification , getNotification};