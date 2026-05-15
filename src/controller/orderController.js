import httpStatus from "http-status";
import { Order } from "../model/orderModel.js";
import { Cart } from "../model/cartModel.js";
import { Product } from "../model/product.js";

const orderCreate = async (req, res) => {
  try {
    const { fullname, phone, address, city, state, pincode, country } =
      req.body;

      // find cart
      const cart = await Cart.findOne({
        user:req.user.id
      });

      if(!cart || cart.items.length === 0){
        return res.status(400).json({message:"Cart is Empty."});
      }

      // create order
      const order = await Order.create({
        user:req.user.id,
        items:cart.items,
        shippingAddress:{
            fullname,
            phone,
            address,
            city,
            state,
            pincode,
            country
        },
        totalPrice:cart.totalPrice
      });

      // update stock
      for(const item of cart.items){
        await Product.findByIdAndUpdate(item.product, {
            $inc:{
                stock:-item.quantity
            }
        });
      }

      // clear cart
      cart.items=[];
      cart.totalItems=0;
      cart.totalPrice=0;

      await cart.save();

      res.status(httpStatus.OK).json({message:"Order placed successfully", order});
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};


// get my order
const getMyOrder = async (req, res) => {
    try{
        const orders = await Order.find({
            user:req.user.id
        }).populate("items.product").sort({createdAt:-1});

        if(!orders){
            return res.status(httpStatus.NOT_FOUND).json({message:"No existing Order"});
        }

        res.status(httpStatus.OK).json(orders);


    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

//update order status
const updateOrderStatus = async (req, res) => {
  try{
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate("items.product");

    if(!order){
      return res.status(httpStatus.NOT_FOUND).json({message:"Order not found"});
    }

    //check seller authorization
    const sellerOwnsProducts = order.items?.some(
      (item) => item?.product?.seller?.toString() === req.user.id
    );

    if(!sellerOwnsProducts) {
      return res.status(httpStatus.UNAUTHORIZED).json({message:"Unauthorized Access"});
    }

    order.orderStatus = status;
    
    await order.save();

    res.status(httpStatus.OK).json({message:"Status Updated Successfully!"});
    
  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}

export { orderCreate, getMyOrder, updateOrderStatus };
