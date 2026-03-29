import { Router } from "express";
import { SearchController } from "./search.controller";

const router = Router();

// 🌍 Public doctor search (Marketplace style)
router.get("/doctors", SearchController.searchDoctors);

export default router;