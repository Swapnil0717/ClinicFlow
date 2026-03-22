import { Router } from "express";
import * as doctorController from "./doctor.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);

// Admin only
router.post(
  "/",
  authMiddleware,
  allowRoles("ADMIN"),
  doctorController.createDoctor
);

// Doctor self update
router.patch(
  "/me",
  authMiddleware,
  allowRoles("DOCTOR"),
  doctorController.updateMyProfile
);

router.post(
  "/complete-profile",
  authMiddleware,
  allowRoles("DOCTOR"),
  doctorController.completeProfile
);

export default router;