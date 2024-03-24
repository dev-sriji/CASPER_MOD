import mongoose from "mongoose";
import Config from "../config.js";
import * as colors from "colors";

const connectToMongoDB = async () => { 
    try {
        await mongoose.connect(Config.MONGO_URI)
        console.log("Connected To Mongo With Status Code : 200".bgGreen)
    } catch (error) {
        console.log("Error Connecting To MongoDB...\n".bgRed,error)
    }
};

export { connectToMongoDB };
