import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, fullname, password } = req.body

    // if any fields are emoty it will throw error and terminate the process
    if ([fullname, email, username, password].some((fields) => fields?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // This is a MongoDB query using Mongoose to check if a user exists in the database.
    // $or is a MongoDB operator that allows you to match one or more condition
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    
    if (existedUser) {
        throw new ApiError(400, "User with email or username already existed")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;  // Finally, it retrieves the file path of the first uploaded file.
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log(avatarLocalPath);
    

    // we check avatarfile exist or not because in databse we use required true . CoverImage is not required true that why we not check coverImage exist or not we check only avatarLocalPath
    // this check user give image or not 
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required on local")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // this check useriamge uplaod on cloudinary or not 
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required on cloudx")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,  // this will always come because we check in if condition
        coverImage: coverImage?.url || "",  // If coverImage?.url is undefined or null, it defaults to an empty string ("") ? operator tell if coverImage not find so not a problem store empty string.
    })

    // This statement fetches a just created user from the database by using their _id while excluding the password and refreshToken fields from the result means in createdUser all the user data email username will come except passwrod and refreshToken .
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // if not find createdUser throw erro
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // if createdUser found return repsones 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export { registerUser }