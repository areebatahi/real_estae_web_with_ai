import express from "express";
import { getLeads, createLead, updateLead } from "../controllers/leadController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "manager", "agent"), getLeads);
router.post("/", createLead); // public — every CTA on the site generates a lead
router.put("/:id", protect, authorize("admin", "manager", "agent"), updateLead);

export default router;
