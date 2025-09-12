import { User } from "../models/User.js";
import httpStatus from "http-status";

export let authMiddleware= async(req,res,next)=>{
    try{
        let authHeader=req.headers["authorization"];
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"No token provided"});
        }
        let token=authHeader.split(" ")[1];

        let user=await User.findOne({token});
        if(!user){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid token"});
        }
        // If user is found, call next middleware
        next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Server error"});
    }
}