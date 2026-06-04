import httpStatus from "http-status";
import { Notification } from "../model/notificationModel.js";

const createNotification = async (req, res) => {
    try{
        const notifications = await Notification.create({
            ...req.body,
            user: req.user.id,
        });

        await notifications.save();
        res.status(httpStatus.OK).json({message:"notification send!"});
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export {createNotification};