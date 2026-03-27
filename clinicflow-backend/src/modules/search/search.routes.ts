import { Router } from "express";
import { SearchController } from "./search.controller";

const router = Router();

// Public search
router.get("/doctors", SearchController.searchDoctors);

export default router;