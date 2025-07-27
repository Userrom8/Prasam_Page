import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js";
import sendEmail from "../utils/email.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "You are not an authorized admin." });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set expiration for 10 minutes

    await Admin.findByIdAndUpdate(admin._id, {
      otp: otp,
      otpExpires: otpExpires,
    });

    // Send OTP to user's email
    await sendEmail({
      email: admin.email,
      subject: "Your Login OTP",
      message: `Your one-time password is: ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Clear OTP fields after successful verification
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    // Create JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP." });
  }
};
