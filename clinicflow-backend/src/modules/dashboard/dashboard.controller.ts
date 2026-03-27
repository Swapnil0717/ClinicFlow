import { Response } from "express";
import { DashboardService } from "./dashboard.service";
import { AuthRequest } from "../../types/express";

export class DashboardController {

  // ======================================
  // 🩺 DOCTOR DASHBOARD (SaaS + Analytics)
  // ======================================
  static async getDoctorDashboard(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      // 🔐 AUTH CHECK
      if (!user || user.role !== "DOCTOR") {
        return res.status(403).json({
          message: "Only doctors can access this dashboard",
        });
      }

      if (!user.doctorId || !user.clinicId) {
        return res.status(400).json({
          message: "Doctor is not properly assigned to clinic",
        });
      }

      const data = await DashboardService.getDoctorDashboard({
        doctorId: user.doctorId,
        clinicId: user.clinicId,
      });

      return res.status(200).json({
        success: true,
        message: "Doctor dashboard fetched successfully",
        data,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch doctor dashboard",
      });
    }
  }

  // ======================================
  // 👤 PATIENT DASHBOARD (SaaS SAFE)
  // ======================================
  static async getPatientDashboard(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      // 🔐 AUTH CHECK
      if (!user || user.role !== "PATIENT") {
        return res.status(403).json({
          message: "Only patients can access this dashboard",
        });
      }

      const data = await DashboardService.getPatientDashboard({
        patientId: user.userId,
        clinicId: user.clinicId, // can be null (allowed)
      });

      return res.status(200).json({
        success: true,
        message: "Patient dashboard fetched successfully",
        data,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch patient dashboard",
      });
    }
  }

  // ======================================
  // 🏥 ADMIN / CLINIC DASHBOARD (BONUS)
  // ======================================
  static async getClinicDashboard(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({
          message: "Only admins can access clinic dashboard",
        });
      }

      if (!user.clinicId) {
        return res.status(400).json({
          message: "Admin is not linked to any clinic",
        });
      }

      const data = await DashboardService.getClinicDashboard({
        clinicId: user.clinicId,
      });

      return res.status(200).json({
        success: true,
        message: "Clinic dashboard fetched successfully",
        data,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch clinic dashboard",
      });
    }
  }
}