import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB = async () => {
    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongo DB Connected : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("Error Occur In Connection : ", error);
        throw error
    }
}

export default connectDB ;