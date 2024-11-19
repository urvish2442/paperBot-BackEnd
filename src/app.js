import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import requestIp from "request-ip";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";
import morganMiddleware from "./logger/morgan.logger.js";
import { ApiError } from "./utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(
    file?.replace(
        "- url: ${{server}}",
        `- url: ${
            process.env.PROJECT_HOST_URL || "http://localhost:4000"
        }/api/v1`
    )
);

const app = express();

const httpServer = createServer(app);

// global middlewares
app.use(
    cors({
        origin:
            process.env.CORS_ORIGIN === "*"
                ? "*"
                : process.env.CORS_ORIGIN?.split(","),
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

// * healthcheck
app.use("/api/v1/healthcheck", healthcheckRouter);

// * App apis
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/questions", questionRoutes);


// * API DOCS
// ? Keeping swagger code at the end so that we can load swagger on "/" route
app.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            docExpansion: "none", // keep all the sections collapsed by default
        },
        customSiteTitle: "FreeAPI docs",
    })
);

// common error handling middleware
app.use(errorHandler);

export { httpServer };
