import httpStatus from "http-status";
import { Product } from "../model/product.js";
import { Cart } from "../model/cartModel.js";

// add to cart api
const addToCart = async (req, res)=>{
    try{
        const {productId, quantity} = req.body;

        // check product
        const product = await Product.findById(productId);

        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({message:"Product not found!"});
        }

        // stock check
        if(product.stock < quantity){
            return res.status(400).json({message:"Insufficient stock"});
        }

        // find user cart
        let cart = await Cart.findOne({user:req.user.id});

        // create cart if not exists
        if(!cart){
            cart = new Cart({
                user:req.user.id,
                items:[{
                    product:productId,
                    quantity,
                    price:product.price
                }]
            });
        } else{
            // check existing item
            const itemIndex = cart.items.findIndex((item)=> item.product.toString() === productId);

            // if product already exists
            if(itemIndex > -1){
                cart.items[itemIndex].quantity +=quantity;
            } else {
                // add new product
                cart.items.push({
                    product:productId,
                    quantity,
                    price:product.price
                });
            }
        }

        //recalculate totals
        cart.totalPrice = cart.items.reduce((acc, item)=> acc + (item.price * item.quantity), 0);

        cart.totalItems = cart.items.reduce((acc, item)=> acc + item.quantity, 0);

        await cart.save();

        res.status(httpStatus.OK).json({message:"Product added to cart", cart});

    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

// get cart items
const getCartItems = async (req, res) => {
    try{

        const cart = await Cart.findOne({user:req.user.id}).populate("items.product");

        if(!cart){
            return res.status(httpStatus.OK).json({
                message: "Cart is empty",
                cart: {
                    items: [],
                    totalItems: 0,
                    totalPrice: 0,
                },
            });
        }

        res.status(httpStatus.OK).json(cart);
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}


//Update Cart quantity
const updateCartQuantity = async (req, res) => {
    try{
        const {productId} = req.params;
        const {quantity} = req.body;

        const cart = await Cart.findOne({
            user:req.user.id
        });

        if(!cart){
            return res.status(httpStatus.NOT_FOUND).json({message:"Cart not found"});
        }

        const item = cart.items.find((item)=> item.product.toString() === productId);

        if(!item){
            return res.status(httpStatus.NOT_FOUND).json({message:"Item not found"});
        }

        item.quantity = quantity;

        // remove item when quantity <= 0

        cart.items = cart.items.filter((item)=> item.quantity > 0);

        //recalculate total 
        cart.totalPrice = cart.items.reduce((acc, item)=> acc+(item.price * item.quantity), 0);

        cart.totalItems = cart.items.reduce((acc, item)=> acc + item.quantity, 0);

        await cart.save();

        const updatedCart = await Cart.findOne({
            user:req.user.id
        }).populate("items.product");

        res.status(httpStatus.OK).json(updatedCart)

    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}
export {addToCart, getCartItems, updateCartQuantity};