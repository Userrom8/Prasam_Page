import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import filesRouter from "./routes/files.js";

// Connect to MongoDB before starting the server
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("this indicates the photo API is working!");
});

// The router no longer needs gfs or conn passed to it
app.use("/api", filesRouter);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
