import express from "express";
import ReservationController from "../../../application/controllers/ReservationController.js";
import { authenticateJWT } from "../../../application/middlewares/passportMiddleware.js";

const router = express.Router();
const reservationController = new ReservationController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - hotel
 *         - guestDetails
 *         - checkInDate
 *         - checkOutDate
 *         - totalPrice
 *         - rooms
 *       properties:
 *         user:
 *           type: string
 *           description: User ID who made the reservation.
 *         hotel:
 *           type: string
 *           description: Hotel ID where the reservation is made.
 *         guestDetails:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - phone
 *             - address
 *             - email
 *           properties:
 *             firstName:
 *               type: string
 *               description: Guest's first name.
 *             lastName:
 *               type: string
 *               description: Guest's last name.
 *             phone:
 *               type: string
 *               description: Guest's contact phone number.
 *             address:
 *               type: string
 *               description: Guest's address.
 *             email:
 *               type: string
 *               description: Guest's email address.
 *         checkInDate:
 *           type: string
 *           format: date-time
 *           description: Check-in date.
 *         checkOutDate:
 *           type: string
 *           format: date-time
 *           description: Check-out date.
 *         totalPrice:
 *           type: number
 *           description: Total price for the reservation.
 *         rooms:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - room
 *               - quantity
 *             properties:
 *               room:
 *                 type: string
 *                 description: Room ID.
 *               quantity:
 *                 type: number
 *                 description: Number of rooms reserved for this type.
 *               status:
 *                 type: string
 *                 enum: [confirmed, cancelled]
 *                 description: Status of this room reservation.
 *               cancellationReason:
 *                 type: string
 *                 description: Reason for cancellation (if cancelled).
 *               cancellationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date of cancellation.
 *         modificationCount:
 *           type: number
 *           description: Number of modifications made to the reservation.
 *
 *     ReservationUpdate:
 *       type: object
 *       properties:
 *         checkInDate:
 *           type: string
 *           format: date-time
 *           description: Updated check-in date.
 *         checkOutDate:
 *           type: string
 *           format: date-time
 *           description: Updated check-out date.
 *         totalPrice:
 *           type: number
 *           description: Updated total price.
 *         rooms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               room:
 *                 type: string
 *               quantity:
 *                 type: number
 *
 *     CancelRequest:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           description: Reason for cancellation.
 *
 *     PartialCancelRequest:
 *       type: object
 *       required:
 *         - cancelQuantity
 *         - reason
 *       properties:
 *         cancelQuantity:
 *           type: number
 *           description: Number of rooms to cancel.
 *         reason:
 *           type: string
 *           description: Reason for partial cancellation.
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input data
 */
router.post(
  "/",
  authenticateJWT("client"),
  reservationController.createReservation
);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation details by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */
router.get(
  "/:id",
  authenticateJWT("client"),
  reservationController.getReservationById
);

/**
 * @swagger
 * /reservations/user:
 *   get:
 *     summary: Get reservations for the current authenticated user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, pending, cancelled]
 *         description: Filter reservations by status
 *     responses:
 *       200:
 *         description: List of reservations for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/user/books",
  authenticateJWT("client"),
  reservationController.getReservationsByUser
);

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation details
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationUpdate'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid update data or maximum modifications reached
 */
router.put(
  "/:id",
  authenticateJWT("client"),
  reservationController.updateReservation
);

/**
 * @swagger
 * /reservations/{id}/cancel:
 *   post:
 *     summary: Cancel the entire reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelRequest'
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Cancellation not permitted
 */
router.post(
  "/:id/cancel",
  authenticateJWT("client"),
  reservationController.cancelEntireReservation
);

/**
 * @swagger
 * /reservations/{id}/rooms/{roomId}/cancel:
 *   post:
 *     summary: Partially cancel some rooms in a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID for which to cancel a portion of the reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartialCancelRequest'
 *     responses:
 *       200:
 *         description: Partial cancellation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Cancellation not permitted or invalid data
 */
router.post(
  "/:id/rooms/:roomId/cancel",
  authenticateJWT("client"),
  reservationController.cancelPartialReservation
);

export default router;
