import { Response } from "express";
import prisma from "../../config/db";
import { AuthRequest } from "../../types/express";
import { AppointmentService } from "./appointment.service";

export class AppointmentController {

  // ================================
  // 📅 BOOK APPOINTMENT
  // ================================
  static async bookAppointment(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "PATIENT") {
        return res.status(403).json({
          message: "Only patients can book",
        });
      }

      const { subSlotId } = req.body;

      const patient = await prisma.patient.findUnique({
        where: { userId: user.userId },
      });

      if (!patient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }

      const result = await AppointmentService.bookAppointment({
        patientId: patient.id,
        subSlotId,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ================================
  // ❌ PATIENT CANCEL
  // ================================
  static async cancelAppointment(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "PATIENT") {
        return res.status(403).json({
          message: "Only patients allowed",
        });
      }

      const { appointmentId } = req.params;

      const patient = await prisma.patient.findUnique({
        where: { userId: user.userId },
      });

      if (!patient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }

      const result = await AppointmentService.cancelAppointment({
        appointmentId,
        patientId: patient.id,
      });

      return res.json({
        success: true,
        data: result,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ================================
  // 🩺 DOCTOR CANCEL
  // ================================
  static async cancelAppointmentByDoctor(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "DOCTOR") {
        return res.status(403).json({
          message: "Only doctors allowed",
        });
      }

      const { appointmentId } = req.params;

      const result = await AppointmentService.cancelAppointmentByDoctor({
        appointmentId,
        doctorId: user.doctorId!,
      });

      return res.json({
        success: true,
        data: result,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

    // ================================
  // 👤 PATIENT APPOINTMENTS
  // ================================
  static async getPatientAppointments(req: AuthRequest, res: Response) {
    try {
      const patientId = req.user.userId; // ⚠️ we will fix this below

      const data = await AppointmentService.getPatientAppointments(patientId);

      return res.json({
        success: true,
        data,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ================================
  // 🩺 DOCTOR APPOINTMENTS
  // ================================
  static async getDoctorAppointments(req: AuthRequest, res: Response) {
    try {
      const doctorId = req.user.doctorId;
      const clinicId = req.user.clinicId;

      const data = await AppointmentService.getDoctorAppointments(
        doctorId,
        clinicId
      );

      return res.json({
        success: true,
        data,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}