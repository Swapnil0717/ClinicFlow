import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  AppointmentController.bookAppointment
);

export default router;