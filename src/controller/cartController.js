import httpSatus from "http-status";
import { Product } from "../model/product.js";
import { Cart } from "../model/cartModel.js";

const addToCart = async (req, res)=>{
    try{
        const {productId, quantity} = req.body;

        // check product
        const product = await Product.findById(productId);

        if(!product){
            return res.status(httpSatus.NOT_FOUND).json({message:"Product not found!"});
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

        res.status(httpSatus.OK).json({message:"Product added to cart", cart});

    } catch(e){
        res.status(httpSatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export {addToCart};