import express from "express";
import RoomController from "../../../application/controllers/RoomController.js";
import { validateBodyRequest } from "../../../application/middlewares/validator.js";
import {
  roomValidationCreateRules,
  roomValidationUpdateRules
} from "../../../application/middlewares/Validators/roomValidator.js";
import { authenticateJWT } from "../../../application/middlewares/passportMiddleware.js";

const router = express.Router();
const roomController = new RoomController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - hotel
 *         - type
 *         - capacity
 *         - price
 *       properties:
 *         hotel:
 *           type: string
 *           description: The ID of the hotel to which the room belongs
 *         type:
 *           type: string
 *           description: The type of the room (e.g., Single, Double, Suite)
 *         capacity:
 *           type: number
 *           description: The capacity of the room
 *           example: 2
 *         price:
 *           type: number
 *           description: The price of the room per night
 *           example: 150
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of amenities available in the room
 *         isAvailable:
 *           type: boolean
 *           description: Whether the room is available
 *           example: true
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: The room was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid request
 */
router.post(
  "/",
  validateBodyRequest(roomValidationCreateRules),
  roomController.createRoom
);

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: hotel
 *         schema:
 *           type: string
 *         description: Filter rooms by hotel ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter rooms by type (e.g., Suite, Single)
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: number
 *         description: Filter rooms by capacity
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Filter rooms with a minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter rooms with a maximum price
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.get("/", roomController.getAllRooms);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to retrieve
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 */
router.get("/:id", roomController.getRoomById);

router.get("/hotel/:id", roomController.getRoomsByHotelId);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to update
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: The room was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 */
router.put(
  "/:id",
  authenticateJWT("admin"),
  validateBodyRequest(roomValidationUpdateRules),
  roomController.updateRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     tags: [Rooms]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to delete
 *     responses:
 *       200:
 *         description: The room was successfully deleted
 *       404:
 *         description: Room not found
 */
router.delete("/:id", authenticateJWT("admin"), roomController.deleteRoom);

export default router;
