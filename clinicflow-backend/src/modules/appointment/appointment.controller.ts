import { Response } from "express";
import { AppointmentService } from "./appointment.service";
import { AuthRequest } from "../../types/express";

export class AppointmentController {

  static async bookAppointment(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "PATIENT") {
        return res.status(403).json({
          message: "Only patients can book appointments",
        });
      }

      const { subSlotId } = req.body;

      if (!subSlotId) {
        return res.status(400).json({
          message: "subSlotId is required",
        });
      }

      const appointment = await AppointmentService.bookAppointment({
        patientId: user.userId,
        subSlotId,
      });

      return res.status(201).json({
        message: "Appointment booked successfully",
        data: appointment,
      });

    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}