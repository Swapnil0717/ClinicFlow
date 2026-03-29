import { Request, Response } from "express";
import { SlotService } from "./slot.service";
import { AuthRequest } from "../../types/express";

export class SlotController {

  // ===============================
  // CREATE CUSTOM SLOT
  // ===============================
  static async createCustomSlot(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "DOCTOR") {
        return res.status(403).json({
          message: "Only doctors can create slots",
        });
      }

      const result = await SlotService.createCustomSlot({
        clinicId: user.clinicId!,
        doctorId: user.doctorId!,
        ...req.body,
      });

      return res.status(201).json({
        message: "Custom slot created",
        data: result,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  // ===============================
  // GET AVAILABLE SLOTS
  // ===============================
  static async getAvailableSlots(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { date, clinicId } = req.query;

      if (!clinicId || !date) {
        return res.status(400).json({
          message: "clinicId and date are required",
        });
      }

      const result = await SlotService.getAvailableSlots({
        clinicId: clinicId as string,
        doctorId,
        date: date as string,
      });

      return res.status(200).json({
        data: result,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  // ===============================
  // CREATE RECURRING SLOT
  // ===============================
  static async createRecurringSlot(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user || user.role !== "DOCTOR") {
        return res.status(403).json({
          message: "Only doctors allowed",
        });
      }

      const result = await SlotService.createRecurringSlot({
        clinicId: user.clinicId!,
        doctorId: user.doctorId!,
        ...req.body,
      });

      return res.status(201).json({
        message: "Recurring slot created",
        data: result,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}