import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

// BOTH ARE SAME WORKING BUT 2ND IN MORE CLEANER USING ROUTE
// router.post("/register", registerUser)

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

export default router