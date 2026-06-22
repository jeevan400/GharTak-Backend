import httpStatus from "http-status";

const allowAdminSeller = (req, res, next)=>{
    try{
        if(req.user.role !== "seller" && req.user.role !== "admin"){
            return res.status(403).json({message:"Admin and Seller Access Denied!"});
        }
        next();
    }catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export default allowAdminSeller;