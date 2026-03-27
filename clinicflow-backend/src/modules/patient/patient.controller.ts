import { Response } from "express";
import { PatientService } from "./patient.service";
import { AuthRequest } from "../../types/express";

export class PatientController {

  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "PATIENT") {
        return res.status(403).json({
          message: "Only patients can access dashboard",
        });
      }

      const data = await PatientService.getDashboard(user.userId);

      return res.status(200).json({
        message: "Patient dashboard fetched",
        data,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}