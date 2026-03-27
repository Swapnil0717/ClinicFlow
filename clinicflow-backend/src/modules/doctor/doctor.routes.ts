import { Router } from "express";
import * as doctorController from "./doctor.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";

const router = Router();

router.post("/", authMiddleware(["ADMIN"]), doctorController.createDoctor);
router.get("/", authMiddleware(), doctorController.getAllDoctors);
router.patch("/me", authMiddleware(["DOCTOR"]), doctorController.updateMyProfile);

export default router;