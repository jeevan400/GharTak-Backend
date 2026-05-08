import httpStatus from "http-status";

const isAdmin = (req, res, next)=>{
    try{
        // console.log("this is admin middleware ", req.user);
        if(req.user.role !== "admin"){
            return res.status(403).json({message: "Admin access denied!"});
        }

        next();
    } catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:e.message});
    }
}

export default isAdmin;