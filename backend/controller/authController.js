import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password!" });
    }

    // 2) Check if admin exists && password is correct
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // 3) If everything is ok, send token to client
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIES_IN || "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login." });
  }
};
