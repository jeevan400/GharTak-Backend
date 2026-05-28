import httpStatus from "http-status";
import { Order } from "../model/orderModel.js";
import { Cart } from "../model/cartModel.js";
import { Product } from "../model/product.js";

const orderCreate = async (req, res) => {
  try {
    const { fullname, phone, address, city, state, pincode, country, deliveryMethod, isPaymentMethod} =
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
        totalPrice:cart.totalPrice,
        deliveryMethod:deliveryMethod,
        paymentMethod:isPaymentMethod
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
    if(req.user.role !== "admin"){
      const sellerOwnsProducts = order.items?.some(
      (item) => item?.product?.seller?.toString() === req.user.id
    );

    if(!sellerOwnsProducts) {
      return res.status(httpStatus.UNAUTHORIZED).json({message:"Unauthorized Access"});
    }
    }

    order.orderStatus = status;
    
    await order.save();

    res.status(httpStatus.OK).json({message:"Status Updated Successfully!"});
    
  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}


// get all orders 
const getAllOrders = async (req, res) => {
  try{

    if(req.user.role !== "admin"){
      return res.status(httpStatus.UNAUTHORIZED).json({message:"Only admin see all orders!"});
    }

    const orders = await Order.find().populate("user").populate("items.product");

    res.status(httpStatus.OK).json(orders);

  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}


// cancle order
const cancelOrder = async (req, res) => {
  try{
    const order = await Order.findById(req.params.id);

    if(!order){
      return res.status(httpStatus.NOT_FOUND).json({message:"Order not found"});
    }

    if(order.orderStatus === "Cancelled"){
      return res.status(400).json({message:"Order already cancelled."});
    }

    if(order.orderStatus === "Delivered"){
      return res.status(httpStatus.BAD_REQUEST).json({message:"Delivered Order cannot be Cancelled."});
    }

    for(const item of order.items){

      const productId = item.product;

      const product = await Product.findById(productId);

      if(!product){
        return res.status(httpStatus.NOT_FOUND).json({message:"Product not found"});
      }

      product.stock += item.quantity;

      await product.save();

    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.status(httpStatus.OK).json({message:"Order Cancelled!"});

  } catch(e){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
  }
}

export { orderCreate, getMyOrder, updateOrderStatus, getAllOrders, cancelOrder };
