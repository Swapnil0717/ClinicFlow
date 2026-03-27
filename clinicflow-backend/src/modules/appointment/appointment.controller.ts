import { Response } from "express";
import { AppointmentService } from "./appointment.service";
import { AuthRequest } from "../../types/express";
import { asyncHandler } from "../../utils/asyncHandler";

export class AppointmentController {

  static bookAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const appointment = await AppointmentService.bookAppointment({
      patientId: req.user!.userId,
      subSlotId: req.body.subSlotId,
      clinicId: req.user!.clinicId!,
    });

    res.status(201).json({
      message: "Appointment booked",
      data: appointment,
    });
  });

  static cancelAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await AppointmentService.cancelAppointment({
      appointmentId: req.params.appointmentId,
      patientId: req.user!.userId,
      clinicId: req.user!.clinicId!,
    });

    res.json({ message: "Cancelled", data: result });
  });

  static getDoctorAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await AppointmentService.getDoctorAppointments(
      req.user!.doctorId!,
      req.user!.clinicId!
    );

    res.json({ data });
  });

  static getPatientAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await AppointmentService.getPatientAppointments(
      req.user!.userId,
      req.user!.clinicId!
    );

    res.json({ data });
  });
}