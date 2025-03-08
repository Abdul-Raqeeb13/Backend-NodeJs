import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// function upload files on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"  // what type of file iamge,video,audio raw, auto means its detect automatically
        })
        // file hase been uploaded successfully
        console.log("File Upload Success on Cloudinary", response.url);  // download link
        return response
    }
     catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporaray file as the upload operdation failed
         return null
    }
}

export {uploadOnCloudinary}