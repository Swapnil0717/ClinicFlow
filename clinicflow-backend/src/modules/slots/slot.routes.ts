import { Router } from "express";
import { SlotController } from "./slot.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// ===============================
// CREATE CUSTOM SLOT
// ===============================
router.post(
  "/custom",
  authMiddleware,
  SlotController.createCustomSlot
);

router.get(
  "/:doctorId/available",
  SlotController.getAvailableSlots
);

router.post(
  "/recurring",
  authMiddleware,
  SlotController.createRecurringSlot
);

export default router;