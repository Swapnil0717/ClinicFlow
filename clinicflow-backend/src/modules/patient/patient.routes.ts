import { Router } from "express";
import { PatientController } from "./patient.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware(["PATIENT"]),
  PatientController.getDashboard
);

export default router;