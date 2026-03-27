import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authService from "../auth/auth.service";
import { AuthRequest } from "../../types/express";

export class ClinicController {

  static createClinic = asyncHandler(async (req: AuthRequest, res: Response) => {
    const clinic = await authService.createClinicForUser(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      message: "Clinic created",
      data: clinic,
    });
  });
}