import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generatAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        // we use validesbeforeave because we update the document adding refresh token so when inserting many firelds are requires true so it produce error becausw we jsut add toek so that whe we validaesve false
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

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
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;


    // 2nd way to handle image in first avatarLocalPath we throw new APiError jsut 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

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

const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential");
    }

    const { accessToken, refreshToken } = await generatAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None", // Allow cross-origin cookie access
    }


    console.log("Access Token before setting cookie:", accessToken);
    console.log("Refresh Token before setting cookie:", refreshToken);

    console.log("Response Headers:", res.getHeaders());

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: false }) // Set secure: false for local testing
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Logged in successfully")
        );




})



const userLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: "" } // Correct way to remove a field
        },
        { new: true } // Returns the updated document
    );


    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Looged out"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToekn = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToekn) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodeToken = jwt.verify(incomingRefreshToekn, process.env.REFRESH_TOEKN_SECRET)
    
        const user = await User.findById(decodeToken._id)
    
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }
    
        if (incomingRefreshToekn !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, refreshToken } = await generatAccessAndRefreshToken(user._id)
    
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {accessToken , refreshToken}, "Access token refresh successfully")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})
export { registerUser, loginUser, userLogout, refreshAccessToken }