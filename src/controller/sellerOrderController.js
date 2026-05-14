import httpStatus from 'http-status';
import { Order } from '../model/orderModel.js';

const getSellerOrder = async (req, res) => {
    try{
        const orders = await Order.find().populate("user", "name email").populate("items.product");

        const sellerOrders = orders.filter(
            (order)=> order.items.some(
                (item)=> item?.product?.seller?.toString() === req.user.id
            )
        )

        res.status(httpStatus.OK).json(sellerOrders);
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export {getSellerOrder};