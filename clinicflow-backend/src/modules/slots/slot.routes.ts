import { Router } from "express";
import { SlotController } from "./slot.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// ===============================
// CREATE CUSTOM SLOT
// ===============================
router.post(
  "/custom",
  authMiddleware(["DOCTOR"]),
  SlotController.createCustomSlot
);

// ===============================
// CREATE RECURRING SLOT
// ===============================
router.post(
  "/recurring",
  authMiddleware(["DOCTOR"]),
  SlotController.createRecurringSlot
);

// ===============================
// GET AVAILABLE SLOTS
// ===============================
router.get(
  "/:doctorId",
  SlotController.getAvailableSlots
);

export default router;