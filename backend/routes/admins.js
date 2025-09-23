import express from "express";
import {
  getAllAdmins,
  addAdmin,
  removeAdmin,
} from "../controller/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All these routes are protected
router.use(protect);

router.route("/").get(getAllAdmins).post(addAdmin);

router.route("/:id").delete(removeAdmin);

export default router;
