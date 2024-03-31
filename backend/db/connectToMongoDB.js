import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
const connectToMongoDB = async () => { 
    try {
        await mongoose.connect(Config.MONGO_URI)
        console.log("Connected To Mongo With Status Code : 200")
    } catch (error) {
        console.log("Error Connecting To MongoDB...\n",error)
    }
};

export { connectToMongoDB };
