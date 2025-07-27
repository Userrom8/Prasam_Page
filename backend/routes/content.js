import express from "express";
import * as contentController from "../controller/contentController.js";
import upload from "../middleware/upload.js"; // We will create this next

const router = express.Router();
const { getContent, updateContent, updateTestimonial, removeTestimonialImage } =
  contentController;

// GET /api/content - Get all site content
router.get("/content", getContent);

// PUT /api/content - Update basic text content (heroText, etc.)
router.put("/content", updateContent);

// PUT /api/content/testimonial - Update a testimonial (handles file upload)
// 'image' must match the key used in the FormData on the frontend.
router.put("/content/testimonial", upload.single("image"), updateTestimonial);

// DELETE /api/content/testimonial/:index/image - Remove a testimonial's image
router.delete("/content/testimonial/:index/image", removeTestimonialImage);

export default router;
