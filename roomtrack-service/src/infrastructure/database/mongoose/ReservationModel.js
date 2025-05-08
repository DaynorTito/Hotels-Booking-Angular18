import mongoose from "mongoose";

const ReservationRoomSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed"
  },
  cancellationReason: { type: String, trim: true },
  cancellationDate: { type: Date }
});

const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    guestDetails: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true }
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    modificationCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "pending"
    },
    rooms: [ReservationRoomSchema]
  },
  {
    timestamps: true
  }
);

export const Reservation = mongoose.model("Reservation", ReservationSchema);
