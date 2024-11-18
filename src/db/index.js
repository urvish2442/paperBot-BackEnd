import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import logger from "../logger/winston.logger.js";

/** @type {typeof mongoose | undefined} */
export let dbInstance = undefined;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI
        );
        dbInstance = connectionInstance;
        logger.info(
            `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
        );
    } catch (error) {
        logger.error("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
