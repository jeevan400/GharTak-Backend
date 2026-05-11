import { Product } from "../model/product.js";
import httpStatus from "http-status";

// add product api
const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user.id,
    });

    res
      .status(httpStatus.OK)
      .json({ message: "Product added successfully.", product });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

//get my products api
const getMyProduct = async (req, res) => {
  try {
    // console.log("this is request object ", req);
    const products = await Product.find({seller:req.user.id});
    
    if(!products){
        return res.status(400).json({message:"product is not found"});
    }
     
    res.status(httpStatus.OK).json(products);
    // console.log("this is a my products ", products);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// update product api 
const updateProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({message:"Product not found."});
        }

        //seller ownership check
        if(product.seller.toString() !== req.user.id){
            return res.status(httpStatus.FORBIDDEN).json({message:"You are not authorized to update this product"});
        }

        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        ).select("-seller");

        res.status(httpStatus.OK).json({message:"Product Updated successfully!"});

    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}


// delete product api 
const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({message:"Product not found."});
        }

        if(product.seller.toString() !== req.user.id){
            return res.status(httpStatus.FORBIDDEN).json({message:"You are not authorized to delete this product."});
        }

        await product.deleteOne();

        res.status(httpStatus.OK).json({message:"Product delete successfully."});
    }catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export { addProduct, getMyProduct, updateProduct, deleteProduct };
