import { Request, Response } from "express";
import { SearchService } from "./search.service";

export class SearchController {

  static async searchDoctors(req: Request, res: Response) {
    try {
      const { specialization, date } = req.query;

      const doctors = await SearchService.searchDoctors({
        specialization: specialization as string,
        date: date as string,
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