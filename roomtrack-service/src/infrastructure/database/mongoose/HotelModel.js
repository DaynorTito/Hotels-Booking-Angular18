import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true,
        index: true
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    amenities: [
      {
        type: String,
        trim: true
      }
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    images: [
      {
        type: String,
        trim: true
      }
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Hotel = mongoose.model("Hotel", HotelSchema);
