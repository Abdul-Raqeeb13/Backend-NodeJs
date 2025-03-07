
// ----------------- DATABASE CONNECTIVITY APPROACHES 2ND APPROACH IS MORE PROFESSIONAL -----------------------

// 1st approach to connect database directly in index.js

/* 
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express"
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error Occur in Connectivity : ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App Listen on port : ${process.env.PORT}`);

        })
    } catch (error) {
        console.log("Error : ", error);
        throw error
    }
}) 
*/



// 2nd approach to make a folder Database and then create file in folder index.js then write DB connectivity code

/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongo DB Connected : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("Error : ", error);
        throw err
    }
}

export default connectDB ;
*/




// ------------- .ENV FILE APPROACHES 2ND APPROACH IS MORE PROFESSIONAL-----------------------


// 1st Approcah

/*
 require("dotenv").config();
*/

// 2nd Approach ->
 
/*

 original env documentation text (As early as possible in your application, import and configure dotenv:) means import in your entry file index.js


import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

changes in package.json file in script section

"dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"

*/















