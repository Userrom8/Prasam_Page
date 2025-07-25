import express from "express";
import upload from "../middleware/upload.js"; // The new memory storage middleware
import * as fileController from "../controller/fileController.js";

const router = express.Router();

// Destructure the controller functions
const { getFiles, uploadFile, displayFile } = fileController;

// @route   GET /api/files
// @desc    Get all image metadata
router.get("/files", getFiles);

// @route   POST /api/upload
// @desc    Upload a new image
router.post("/upload", upload.single("file"), uploadFile);

// @route   GET /api/image/:filename
// @desc    Display a single image
router.get("/image/:filename", displayFile);

// @route   DELETE /api/image/:filename
// @desc    Delete a single image
router.delete("/image/:filename", deleteFile);

export default router;
