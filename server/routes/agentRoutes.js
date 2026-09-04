import express from "express";
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../controllers/agentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAgents);
router.get("/:id", getAgentById);
router.post("/", protect, authorize("admin", "manager"), createAgent);
router.put("/:id", protect, authorize("admin", "manager"), updateAgent);
router.delete("/:id", protect, authorize("admin", "manager"), deleteAgent);

export default router;
