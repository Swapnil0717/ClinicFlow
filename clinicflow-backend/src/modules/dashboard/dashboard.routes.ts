import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { DashboardController } from "./dashboard.controller";

const router = Router();

// 🩺 Doctor Dashboard
router.get(
  "/doctor",
  authMiddleware(["DOCTOR"]),
  DashboardController.getDoctorDashboard
);

// 👤 Patient Dashboard
router.get(
  "/patient",
  authMiddleware(["PATIENT"]),
  DashboardController.getPatientDashboard
);

// 🏥 Clinic Dashboard (Admin)
router.get(
  "/clinic",
  authMiddleware(["ADMIN"]),
  DashboardController.getClinicDashboard
);

export default router;