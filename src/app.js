import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { createServer } from "http";
import requestIp from "request-ip";
import morganMiddleware from "./logger/morgan.logger.js";
import { ApiError } from "./utils/ApiError.js";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import path from "path";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yaml";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");

const app = express();

const httpServer = createServer(app);

const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://paperbot-one.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(requestIp.mw());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => {
        return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
    },
    handler: (_, __, ___, options) => {
        throw new ApiError(
            options.statusCode || 500,
            `There are too many requests. You are only allowed ${
                options.max
            } requests per ${options.windowMs / 60000} minutes`
        );
    },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());

app.use(morganMiddleware);

import { errorHandler } from "./middlewares/error.middlewares.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user-routes.js";
import subjectRoutes from "./routes/subject-routes.js";
import questionRoutes from "./routes/question-routes.js";
import questionTypesRoutes from "./routes/que-types-routes.js";

// * healthcheck
app.use("/api/v1/healthcheck", healthcheckRouter);

// * App apis
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/question-types", questionTypesRoutes);

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to the PaperBot App",
    });
});

app.use(errorHandler);

export { httpServer };
