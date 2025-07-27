// upload.js

import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// --- MODIFIED FILE FILTER ---
// This version is more robust as it checks against a specific list of allowed MIME types.
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/pjpeg", // For older versions of IE
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // If the MIME type is in our list, accept the file
    cb(null, true);
  } else {
    // Otherwise, reject it
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Use the updated filter
  limits: {
    // 5MB file size limit
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
