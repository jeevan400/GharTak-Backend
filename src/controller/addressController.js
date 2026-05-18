import httpStatus from "http-status";
import { Address } from "../model/addressModel.js";


const addUserAddress = async (req, res) => {
    try{
        const {fullname, phone, city, state, pincode, country, address} = req.body;

        const newAddress = await Address.create({
            user:req.user.id,
            fullname,
            phone,
            city,
            state,
            pincode,
            country,
            address
        });

        res.status(httpStatus.OK).json({message:"Address save successfully!"});
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

const getUserAddress = async (req, res) => {
    try{
        const address = await Address.find({
            user:req.user.id
        })

        if(!address){
            return res.status(httpStatus.NOT_FOUND).json({message:"Enter your address first"});
        }

        res.status(httpStatus.OK).json(address);
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}


// delete address 
const deleteAddress = async (req, res) => {
    try{
        const address = await Address.findById(req.params.id);

        if(!address){
            return res.status(httpStatus.NOT_FOUND).json({message:"Address not found."});
        }

        if(address.user.toString() !== req.user.id){
            return res.status(httpStatus.FORBIDDEN).json({message:"You are not authorized to delete this Address."});
        }

        await address.deleteOne();

        res.status(httpStatus.OK).json({message:"Address delete successfully!"});

    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});    }
}

// update user Address
const updateUserAddress = async (req, res) =>{
    try{
        const address = await Address.findById(req.params.id);

        if(!address){
            return res.status(httpStatus.NOT_FOUND).json({message:"Address not found."});
        }

        if(address.user.toString() !== req.user.id){
            return res.status(httpStatus.FORBIDDEN).json({message:"You are not authorized to update this product"});
        }

        const updateAddress = await Address.findByIdAndUpdate(req.params.id, req.body, {new:true});

        res.status(httpStatus.OK).json({message:"Address Updated successfully!"});
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({messsage:e.message});
    }
}

export {addUserAddress, getUserAddress, deleteAddress, updateUserAddress};