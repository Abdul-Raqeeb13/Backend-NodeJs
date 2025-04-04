import { Router } from "express";
import { loginUser, registerUser, userLogout, refreshAccessToken, changeCurrentPassowrd, getCurrentUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

// BOTH ARE SAME WORKING BUT 2ND IN MORE CLEANER USING ROUTE
// router.post("/register", registerUser)

// upload.fields is a middleware run before the execution of registerUser afetr uplad it return req.files so we can use in registerUser function (we get request.files in registerUser line no : 28 & 29)
// Uses upload.fields() middleware to handle multiple files in different fields.
router.route("/register").post(upload.fields(
    [
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1

        }
    ]
), registerUser)

router.route("/login").post(loginUser) 

// secured routes
router.route("/logout").post( verifyJWT , userLogout)

router.route("/refresh-Token").post(refreshAccessToken)

router.route("/changePassword").post(verifyJWT , changeCurrentPassowrd)

router.route("/currentUser").get(verifyJWT , getCurrentUser)

export default router



// You use upload.fields() when you need to handle multiple file uploads with different field names in a single request.
// name: "avatar" → Accepts 1 file in the "avatar" field.
// name: "coverImage" → Accepts 1 file in the "coverImage" field.
// maxCount: 1 → Limits each field to 1 file.


// When to Use This?
// ✅ If a form has multiple file fields (e.g., Profile Picture & Cover Image).
// ✅ If each file has a specific purpose (e.g., "avatar" for profile, "coverImage" for background).