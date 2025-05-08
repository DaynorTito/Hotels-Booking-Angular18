import express from "express";
import HotelController from "../../../application/controllers/HotelController.js";
import { validateBodyRequest } from "../../../application/middlewares/validator.js";
import {
  hotelValidationCreateRules,
  hotelValidationUpdateRules
} from "../../../application/middlewares/Validators/hotelValidator.js";
import { authenticateJWT } from "../../../application/middlewares/passportMiddleware.js";

const router = express.Router();
const hotelController = new HotelController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the hotel
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: The address of the hotel
 *             city:
 *               type: string
 *               description: The city where the hotel is located
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   description: Latitude of the hotel
 *                   example: 40.7128
 *                 longitude:
 *                   type: number
 *                   description: Longitude of the hotel
 *                   example: -74.0060
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of amenities offered by the hotel
 *         rating:
 *           type: number
 *           description: Rating of the hotel (0 to 5)
 *           example: 4.5
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of URLs for hotel images
 */

/**
 * @swagger
 * /hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: The hotel was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.post(
  "/",
  validateBodyRequest(hotelValidationCreateRules),
  hotelController.createHotel
);

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter hotels by name
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filter hotels by address
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Filter hotels with a minimum rating
 *     responses:
 *       200:
 *         description: A list of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 */
router.get("/", hotelController.getAllHotels);

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Get a hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hotel to retrieve
 *     responses:
 *       200:
 *         description: The hotel details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found
 */
router.get("/:id", hotelController.getHotelById);

/**
 * @swagger
 * /hotels/{id}:
 *   put:
 *     summary: Update a hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hotel to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: The hotel was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found
 */
router.put(
  "/:id",
  authenticateJWT("admin"),
  validateBodyRequest(hotelValidationUpdateRules),
  hotelController.updateHotel
);

/**
 * @swagger
 * /hotels/{id}:
 *   delete:
 *     summary: Delete a hotel by ID
 *     tags: [Hotels]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hotel to delete
 *     responses:
 *       200:
 *         description: The hotel was successfully deleted
 *       404:
 *         description: Hotel not found
 */
router.delete("/:id", authenticateJWT("admin"), hotelController.deleteHotel);

router.get("/stats/cities", hotelController.getAllCities);

router.get("/stats/max-room-price", hotelController.getMaxRoomPrice);

export default router;
