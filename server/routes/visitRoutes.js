import express from "express";
import { getVisits, createVisit, updateVisit } from "../controllers/visitController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "manager", "agent"), getVisits);
router.post("/", createVisit); // public — customers schedule visits
router.put("/:id", protect, authorize("admin", "manager", "agent"), updateVisit);

export default router;
