import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




// // Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
// });

// // function upload files on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath);

        console.log("in clodinary");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"  // what type of file iamge,video,audio raw, auto means its detect automatically
        })
        // file hase been uploaded successfully
        console.log("File Upload Success on Cloudinary", response.url);  // download link
        await fs.unlinkSync(localFilePath) // afetr uplaod on cloudinary remove the file in publc/temp folder
        return response
    }
    catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporaray file as the upload operdation failed
        console.log(error);

        return null
    }
}

export { uploadOnCloudinary }