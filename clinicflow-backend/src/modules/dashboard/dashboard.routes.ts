import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// 🩺 Doctor
router.get(
  "/doctor",
  authMiddleware(["DOCTOR"]),
  DashboardController.getDoctorDashboard
);

// 👤 Patient
router.get(
  "/patient",
  authMiddleware(["PATIENT"]),
  DashboardController.getPatientDashboard
);

// 🏥 Admin (Clinic)
router.get(
  "/clinic",
  authMiddleware(["ADMIN"]),
  DashboardController.getClinicDashboard
);

export default router;