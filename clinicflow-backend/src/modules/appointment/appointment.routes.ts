import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// 📅 BOOK
router.post(
  "/book",
  authMiddleware(["PATIENT"]),
  AppointmentController.bookAppointment
);

// ❌ PATIENT CANCEL
router.patch(
  "/cancel/:appointmentId",
  authMiddleware(["PATIENT"]),
  AppointmentController.cancelAppointment
);

// 🩺 DOCTOR CANCEL
router.patch(
  "/doctor/cancel/:appointmentId",
  authMiddleware(["DOCTOR"]),
  AppointmentController.cancelAppointmentByDoctor
);

// 👤 PATIENT APPOINTMENTS
router.get(
  "/patient",
  authMiddleware(["PATIENT"]),
  AppointmentController.getPatientAppointments
);

// 🩺 DOCTOR APPOINTMENTS
router.get(
  "/doctor",
  authMiddleware(["DOCTOR"]),
  AppointmentController.getDoctorAppointments
);

export default router;