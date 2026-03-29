import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../types/express";
import { ClinicService } from "./clinic.service";

export class ClinicController {

  static createClinic = asyncHandler(async (req: AuthRequest, res: Response) => {

    const clinic = await ClinicService.createClinicForUser(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      message: "Clinic created successfully",
      data: clinic,
    });
  });

  static getMyClinic = asyncHandler(async (req: AuthRequest, res: Response) => {

    const clinic = await ClinicService.getClinicById(
      req.user!.clinicId!,
      req.user!.clinicId!
    );

    res.json({
      data: clinic,
    });
  });

  static verifyClinic = asyncHandler(async (req: AuthRequest, res: Response) => {
    const clinicId = req.params.id;
  
    const clinic = await ClinicService.verifyClinic(clinicId);
  
    res.json({
      success: true,
      message: "Clinic verified successfully",
      data: clinic,
    });
  });
}