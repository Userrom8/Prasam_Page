import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
});

export default mongoose.model("Admin", adminSchema);
