import { Request, Response } from "express";
import { SlotService } from "./slot.service";
import { SlotMode } from "@prisma/client";
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

      const result = await SlotService.createCustomSlot(req, {
        doctorId: user.doctorId,
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

      const result = await SlotService.getAvailableSlots(req, doctorId);

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
        doctorId: user.doctorId,
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