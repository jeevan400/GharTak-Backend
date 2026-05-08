import httpStatus from "http-status";

const isSeller = (req, res, next)=>{
    try{
        if(req.user.role !== "seller"){
            return res.status(403).json({message:"Seller Access Denied!"});
            next();
        }
    }catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export default isSeller;