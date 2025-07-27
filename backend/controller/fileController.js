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
    //Find the highest order number to place the new image at the end
    const lastImage = await Image.findOne().sort({ order: -1 });
    const newOrder = lastImage ? lastImage.order + 1 : 1;
    // Create a new image document
    const newImage = new Image({
      filename: filename,
      contentType: req.file.mimetype,
      data: req.file.buffer, // The image data from multer's memory storage
      order: newOrder,
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
    // Find all images and sort them by the 'order' field
    const files = await Image.find({}, "-data").sort({ order: "asc" });
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

// New function to handle reordering of images
export const updateImageOrder = async (req, res) => {
  const { orderedIds } = req.body;

  if (!orderedIds || !Array.isArray(orderedIds)) {
    return res.status(400).json({ message: "Invalid data provided." });
  }

  try {
    const updatePromises = orderedIds.map((id, index) =>
      Image.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);
    res.status(200).json({ message: "Image order updated successfully." });
  } catch (err) {
    console.error("Failed to update image order:", err);
    res.status(500).send("Server Error");
  }
};
