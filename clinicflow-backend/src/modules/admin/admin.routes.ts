import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as adminController from "./admin.controller";

const router = Router();

router.get(
  "/pending-clinics",
  authMiddleware(["ADMIN"]),
  adminController.pendingClinics
);

router.get(
  "/pending-doctors",
  authMiddleware(["ADMIN"]),
  adminController.pendingDoctors
);

router.patch(
  "/verify-clinic/:id",
  authMiddleware(["ADMIN"]),
  adminController.verifyClinic
);

router.patch(
  "/verify-doctor/:id",
  authMiddleware(["ADMIN"]),
  adminController.verifyDoctor
);

router.patch(
  "/reject-clinic/:id",
  authMiddleware(["ADMIN"]),
  adminController.rejectClinic
);

router.post(
  "/become",
  authMiddleware(["PATIENT", "DOCTOR"]), 
  adminController.becomeAdminController
);

export default router;