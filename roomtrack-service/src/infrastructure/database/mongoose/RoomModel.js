import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    type: {
      type: String,
      enum: ["Single", "Double", "Triple", "Suite", "Suite with Extra Bed"],
      required: true
    },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    amenities: [String],
    isAvailable: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export const Room = mongoose.model("Room", RoomSchema);
