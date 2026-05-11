import jwt from "jsonwebtoken";
import httpStatus from "http-status";

const verifyToken = (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({message:"No token provided"});
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // console.log("this is decode ", decoded);

        req.user = decoded;

        next();

    } catch(e){
        res.status(401).json({message: e.message});
    }
}

export default verifyToken;