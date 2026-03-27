import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.post("/", authMiddleware(["PATIENT"]), AppointmentController.bookAppointment);
router.patch("/:appointmentId/cancel", authMiddleware(["PATIENT"]), AppointmentController.cancelAppointment);
router.get("/doctor", authMiddleware(["DOCTOR"]), AppointmentController.getDoctorAppointments);
router.get("/patient", authMiddleware(["PATIENT"]), AppointmentController.getPatientAppointments);
export default router;