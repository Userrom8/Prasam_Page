import Image from "../model/imageModel.js";
import crypto from "crypto";
import path from "path";

// @desc    Handles the file upload
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Create a unique filename
  const filename =
    crypto.randomBytes(16).toString("hex") +
    path.extname(req.file.originalname);

  try {
    // Create a new image document
    const newImage = new Image({
      filename: filename,
      contentType: req.file.mimetype,
      data: req.file.buffer, // The image data from multer's memory storage
    });

    // Save the image to the database
    await newImage.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file: { filename: newImage.filename, id: newImage._id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Lists all files (metadata only, not the image data)
export const getFiles = async (req, res) => {
  try {
    // Find all images but exclude the large 'data' field for performance
    const files = await Image.find({}, "-data");
    res.json(files);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// @desc    Displays a single file by its filename
export const displayFile = async (req, res) => {
  try {
    const file = await Image.findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ err: "No file exists" });
    }

    // Set the content type header
    res.contentType(file.contentType);
    // Send the image data buffer as the response
    res.send(file.data);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// @desc    Deletes a file by its filename
export const deleteFile = async (req, res) => {
  try {
    const file = await Image.findOneAndDelete({
      filename: req.params.filename,
    });

    if (!file) {
      return res.status(404).json({ err: "No file exists" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
