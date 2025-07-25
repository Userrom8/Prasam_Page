import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const photosFilePath = path.join(__dirname, "data", "photos.json");

app.use(cors());
app.use(express.json());

// Helper function to read photos
const readPhotos = () => {
  const photosData = fs.readFileSync(photosFilePath);
  return JSON.parse(photosData);
};

// Helper function to write photos
const writePhotos = (photos) => {
  fs.writeFileSync(photosFilePath, JSON.stringify(photos, null, 2));
};

// GET all photos
app.get("/api/photos", (req, res) => {
  res.json(readPhotos());
});

// POST a new photo
app.post("/api/photos", (req, res) => {
  const photos = readPhotos();
  const newPhoto = {
    id: Date.now().toString(), // Unique ID
    url: req.body.url,
  };
  photos.push(newPhoto);
  writePhotos(photos);
  res.status(201).json(newPhoto);
});

// DELETE a photo
app.delete("/api/photos/:id", (req, res) => {
  let photos = readPhotos();
  const photoId = req.params.id;
  const initialLength = photos.length;
  photos = photos.filter((p) => p.id !== photoId);

  if (photos.length < initialLength) {
    writePhotos(photos);
    res.status(200).json({ message: "Photo deleted successfully" });
  } else {
    res.status(404).json({ message: "Photo not found" });
  }
});

// GET route for the root of the app
app.get("/", (req, res) => {
  res.send("this indicates the photo API is working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
