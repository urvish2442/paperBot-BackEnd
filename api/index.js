import dotenv from "dotenv";
// import logger from "../src/logger/winston.logger.js";
import connectDB from "../src/db/index.js";
import { httpServer } from "../src/app.js";

dotenv.config({
    path: "../.env",
});

let isDBConnected = false;

const connectDatabase = async () => {
    if (!isDBConnected) {
        await connectDB();
        isDBConnected = true;
    }
};

export default async (req, res) => {
    try {
        await connectDatabase();
        httpServer.emit("request", req, res);
    } catch (err) {
        console.log("Error in serverless function: ", err);
        res.status(500).send("Internal Server Error");
    }
};
