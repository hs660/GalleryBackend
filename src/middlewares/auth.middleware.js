import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = async (req,res,next) => {

    try {
        const token = req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const admin = await Admin.findById(decoded._id).select("-password");

        if(!admin){
            throw new ApiError(401,"Invalid Access Token");
        }

        req.admin = admin;
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Token");
    }
}