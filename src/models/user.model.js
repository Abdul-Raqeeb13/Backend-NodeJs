import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    avatar: {
        type: String,  // cloudinary url
        required: true,
    },

    coverImage: {
        type: String,  // cloudinary url
    },

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, "Password is required"]  // custome error
    },

    refreshToken: {
        type: String
    }

}, { timestamps: true })


// pre("save", async function (next) { ... }) → Runs before saving a document to the database. 
// -> pre is a hook provided by mongoose

userSchema.pre("save", async function (next) {
    // this.isModified("password") → Checks if the password field has been changed. isModifired buitin in mongoose
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// this is custom method define using (.methods) that allow monogoose define your custom method using .methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        } 
    )
}

userSchema.methods.generateRefreshToken = async function() { 
    return jwt.sign({
        _id: this._id,
    },  
        process.env.REFRESH_TOEKN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOEKN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)