const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "My API",
        version: "1.0.0",
        description: "API documentation for my Express.js app",
    },
    servers: [
        {
            url: "http://localhost:4000/api/v1", // This ensures Swagger is correctly defined for /api/v1
        },
    ],
};

// Options for Swagger JSDoc
const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Adjust to point to correct paths for routes and controllers
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
