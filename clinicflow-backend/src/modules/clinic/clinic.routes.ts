import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { ClinicController } from "./clinic.controller";

const router = Router();

// 🏥 Create clinic (only new users)
router.post(
  "/",
  authMiddleware(["PATIENT"]),
  ClinicController.createClinic
);

// 🏥 Get own clinic
router.get(
  "/me",
  authMiddleware(["ADMIN", "DOCTOR"]),
  ClinicController.getMyClinic
);

router.patch(
  "/verify/:id",
  authMiddleware(["ADMIN"]),
  ClinicController.verifyClinic
);

export default router;