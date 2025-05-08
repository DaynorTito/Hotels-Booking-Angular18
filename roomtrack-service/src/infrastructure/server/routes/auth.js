import express from "express";
import AuthController from "../../../application/controllers/AuthController.js";
import { authenticateJWT } from "../../../application/middlewares/passportMiddleware.js";
import { validateBodyRequest } from "../../../application/middlewares/validator.js";
import {
  registerValidationRules,
  loginValidationRules
} from "../../../application/middlewares/Validators/userValidator.js";

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *         name:
 *           type: string
 *           description: User's full name
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 email:
 *                   type: string
 *                   description: The user email
 *                 name:
 *                   type: string
 *                   description: The user name
 *       400:
 *         description: Invalid input data
 */
router.post(
  "/register",
  validateBodyRequest(registerValidationRules),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Invalid email or password
 */
router.post(
  "/login",
  validateBodyRequest(loginValidationRules),
  authController.login
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *       400:
 *         description: No token provided
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 email:
 *                   type: string
 *                   description: The user email
 *                 name:
 *                   type: string
 *                   description: The user name
 *       401:
 *         description: Unauthorized access
 */
router.get("/me", authenticateJWT(), authController.getCurrentUser);

export default router;
