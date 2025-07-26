import express from "express";
import * as contentController from "../controller/contentController.js";

const router = express.Router();
const { getContent, updateContent } = contentController;

// @route   GET /api/content
// @desc    Get all editable content as a single object
router.get("/content", getContent);

// @route   PUT /api/content
// @desc    Update one or more content values
router.put("/content", updateContent);

export default router;
