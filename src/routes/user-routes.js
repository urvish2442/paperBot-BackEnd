const express = require("express");
const { login, register } = require("../controller/user-Controller");
const {
    loginValidation,
    registerValidation,
} = require("../validators/user-validation");

const app = express.Router();
app.use(express.json());

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with their email and password to get an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
app.post("/login", ...loginValidation, login);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, password, and user name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               userName:
 *                 type: string
 *                 example: john_doe
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: User already exists
 */
app.post("/register", ...registerValidation, register);

module.exports = app;
