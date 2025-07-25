import multer from "multer";

// Use memory storage to hold the file as a buffer in memory
const storage = multer.memoryStorage();

// Function to filter for only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image.", 400), false);
  }
};

// Configure multer with storage, file filter, and size limits
// IMPORTANT: Add a file size limit to prevent oversized images from crashing your server
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // 10MB limit for embedded images. MongoDB documents are limited to 16MB.
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
