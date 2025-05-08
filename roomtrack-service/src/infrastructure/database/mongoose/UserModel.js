import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true,
    lowercase: true,
    default: "client"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model("User", userSchema);
