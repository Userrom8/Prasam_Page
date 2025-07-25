import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import filesRouter from "./routes/files.js";
import contentRouter from "./routes/content.js";

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

// --- MIDDLEWARE ---
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); //required
app.use(express.json());

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("this indicates the photo API is working!");
});

app.use("/api", filesRouter);
app.use("/api", contentRouter);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
