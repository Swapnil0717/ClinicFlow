import { Request, Response } from "express";
import { SearchService } from "./search.service";

export class SearchController {
  static async searchDoctors(req: Request, res: Response) {
    try {
      const { specialization, clinicId } = req.query;

      if (!clinicId) {
        return res.status(400).json({
          message: "clinicId is required",
        });
      }

      const doctors = await SearchService.searchDoctors({
        clinicId: clinicId as string,
        specialization: specialization as string,
      });

      return res.status(200).json({
        message: "Doctors fetched successfully",
        data: doctors,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}