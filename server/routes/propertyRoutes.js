import express from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  compareProperties,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/compare", compareProperties);
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, authorize("admin", "manager"), createProperty);
router.put("/:id", protect, authorize("admin", "manager"), updateProperty);
router.delete("/:id", protect, authorize("admin", "manager"), deleteProperty);

export default router;
