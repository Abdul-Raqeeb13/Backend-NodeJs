import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
    
        // console.log("Access Token from Cookie:", accessToken);
        // console.log("Refresh Token from Cookie:", refreshToken);

        // if (!accessToken) {
        //     return res.status(401).json({ message: "Unauthorized: No token provided" });
        // }

        // console.log(req.cookie?.accessToken);
        
        const token = req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer", "")
        
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)


        console.log("secodetoken" , decodeToken);
        
    
        const user = await User.findById(decodeToken._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access token")
        }
    
        req.user = user
        next()
    } catch (e) {
        throw new ApiError( 401, e?.message || "Invalid access token")
    }

}) 