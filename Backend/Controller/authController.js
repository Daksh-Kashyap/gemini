import bcrypt from 'bcrypt';
import { User } from "../models/User.js";
import httpStatus from "http-status";
import crypto from "crypto";




//Register
let register = async (req, res) => {
    let {name, username, password} = req.body;
    try {
        let existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({message: "User already exists"});
        }
        let hashedPassword=await bcrypt.hash(password,10);
        let newUser=new User({name, username, password:hashedPassword});
        await newUser.save();
        return res.status(httpStatus.CREATED).json({message:"User registered Sucessfully"});
    } catch(error){
        return res.status(500).json({message:`Error: ${error}`});
    }
}

//Login

let login=async (req,res)=>{
    let {username, password}=req.body;
    if(!username || !password){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Provide cardentials"});
    }
    try{
        let user=await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
        }

        let isPassword=await bcrypt.compare(password,user.password);
        if(!isPassword){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid Password"});
        }

        let token=crypto.randomBytes(32).toString('hex');
        user.token=token;
        await user.save();

        return res.status(httpStatus.OK).json({token, username:user.username})
    }catch(error){
        return res.status(500).json({message:`Error: ${error}`})
    }
}

export{register,login};