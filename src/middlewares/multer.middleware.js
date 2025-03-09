import multer from "multer";
import path from "path"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, "./public/temp") ensures the file is stored in this folder.
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
         const ext = path.extname(file.originalname);  // Use path module to handle file extensions
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

export const upload = multer({ storage: storage })


// what multer return after succesfully file uplaod on the folder 
// {
//     "fieldname": "avatar",
//     "originalname": "profile.jpg",
//     "encoding": "7bit",
//     "mimetype": "image/jpeg",
//     "destination": "./public/temp",
//     "filename": "avatar-1710429832654-987654321.jpg",
//     "path": "public/temp/avatar-1710429832654-987654321.jpg",
//     "size": 102345
//   }
  