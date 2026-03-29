import { Request, Response } from "express";
import * as adminService from "./admin.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const verifyClinic = async (req: Request, res: Response) => {
  const clinic = await adminService.verifyClinic(req.params.id);
  res.json(clinic);
};

export const verifyDoctor = async (req: Request, res: Response) => {
  const doctor = await adminService.verifyDoctor(req.params.id);
  res.json(doctor);
};

export const pendingClinics = async (_: Request, res: Response) => {
  const clinics = await adminService.getPendingClinics();
  res.json(clinics);
};

export const pendingDoctors = async (_: Request, res: Response) => {
  const doctors = await adminService.getPendingDoctors();
  res.json(doctors);
};

export const rejectClinic = async (req: Request, res: Response) => {
  const { reason } = req.body;

  const clinic = await adminService.rejectClinic(
    req.params.id,
    reason
  );

  res.json({
    message: "Clinic rejected",
    data: clinic,
  });
};

export const becomeAdminController = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const admin = await adminService.becomeAdmin(userId);

  res.status(200).json({
    success: true,
    message: "User is now an admin",
    data: admin,
  });
});