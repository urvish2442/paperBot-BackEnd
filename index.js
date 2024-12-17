import dotenv from "dotenv";
import { httpServer } from "./src/app.js";
import connectDB from "./src/db/index.js";
// import logger from "./src/logger/winston.logger.js";

dotenv.config({
    path: "./.env",
});

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const initializeServer = async () => {
    if (majorNodeVersion >= 14) {
        try {
            await connectDB();
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error("MongoDB connection error: ", err);
            process.exit(1); // Exit the process if DB connection fails
        }
    } else {
        connectDB().catch((err) => {
            console.error("MongoDB connection error: ", err);
            process.exit(1);
        });
    }
};

await initializeServer();

// Export the server for Vercel
export default httpServer;
