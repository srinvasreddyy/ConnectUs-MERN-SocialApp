import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "./api.error.js";


export const protectRoute = async (req, res, next) =>{
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json(new ApiError(408,"No token found"))
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json(new ApiError(402,"Token is not valid"))
        }
        req.user = await User.findById(decoded.id).select("-password")
        next()
    } catch (error) {
        console.log("error in protectRoute",error)
        return res.status(401).json(new ApiError(403,"Not "))
    }
}