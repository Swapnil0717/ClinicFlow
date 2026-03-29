import { Response } from "express";
import { DashboardService } from "./dashboard.service";
import { AuthRequest } from "../../types/express";
import { asyncHandler } from "../../utils/asyncHandler";

export class DashboardController {

  // 🩺 Doctor Dashboard
  static getDoctorDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const data = await DashboardService.getDoctorDashboard({
      doctorId: user.doctorId!,
      clinicId: user.clinicId!,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor dashboard fetched successfully",
      data,
    });
  });

  // 👤 Patient Dashboard
  static getPatientDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const data = await DashboardService.getPatientDashboard({
      userId: user.userId,
      clinicId: user.clinicId,
    });

    return res.status(200).json({
      success: true,
      message: "Patient dashboard fetched successfully",
      data,
    });
  });

  // 🏥 Clinic Dashboard
  static getClinicDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const data = await DashboardService.getClinicDashboard({
      clinicId: user.clinicId!,
    });

    return res.status(200).json({
      success: true,
      message: "Clinic dashboard fetched successfully",
      data,
    });
  });
}