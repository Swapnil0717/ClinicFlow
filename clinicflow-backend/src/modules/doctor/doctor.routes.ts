import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as doctorController from "./doctor.controller";

const router = Router();

router.post("/", authMiddleware(["ADMIN"]), doctorController.createDoctor);

router.get(
  "/pending",
  authMiddleware(["ADMIN"]),
  doctorController.getPendingDoctors
);

router.patch(
  "/verify/:id",
  authMiddleware(["ADMIN"]),
  doctorController.verifyDoctor
);

router.get(
  "/",
  authMiddleware(["ADMIN", "DOCTOR"]),
  doctorController.getAllDoctors
);

router.get(
  "/:id",
  authMiddleware(),
  doctorController.getDoctorById
);

// 🔥 REJECT DOCTOR
router.patch(
  "/reject/:id",
  authMiddleware(["ADMIN"]),
  doctorController.rejectDoctor
);

export default router;