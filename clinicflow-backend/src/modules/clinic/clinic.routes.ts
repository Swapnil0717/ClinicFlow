import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { ClinicController } from "./clinic.controller";


const router = Router();

router.post("/", authMiddleware(["PATIENT", "ADMIN"]), ClinicController.createClinic);

export default router;