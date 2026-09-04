import express from "express";
import { propertyMatch, compareAssist } from "../controllers/aiController.js";

const router = express.Router();

router.post("/property-match", propertyMatch);
router.post("/compare-assist", compareAssist);

export default router;
