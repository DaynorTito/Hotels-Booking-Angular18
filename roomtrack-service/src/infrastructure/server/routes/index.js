import express from "express";
import hotelRoutes from "./hotels.js";
import roomRoutes from "./rooms.js";
import authRoutes from "./auth.js";
import reservationRoutes from "./reservations.js";

const router = express.Router();

router.use("/hotels", hotelRoutes);
router.use("/rooms", roomRoutes);
router.use("/auth", authRoutes);
router.use("/reservations", reservationRoutes);

export default router;
