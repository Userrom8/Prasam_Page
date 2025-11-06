import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import filesRouter from "./routes/files.js";
import contentRouter from "./routes/content.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admins.js";

// Connect to MongoDB before starting the server
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURE CORS HERE ---
// Define the specific origin that is allowed to access your API
const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};

console.log("CORS Origin configured for:", process.env.ORIGIN);

// --- MIDDLEWARE ---
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); //required
app.use(express.json());

// --- SERVE STATIC FILES ---
// This makes the 'uploads/images' folder publicly accessible via the '/api/image' route.
// For example: http://localhost:5000/api/image/1678886400000.jpg
app.use("/api/image", express.static("uploads/images"));

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("this indicates the photo API is working!");
});

app.use("/api", filesRouter);
app.use("/api", contentRouter);
app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
