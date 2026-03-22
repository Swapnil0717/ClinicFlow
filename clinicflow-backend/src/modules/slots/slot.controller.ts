import { Request, Response } from "express";
import { SlotService } from "./slot.service";
import { SlotMode } from "@prisma/client";

export class SlotController {

  // ===============================
  // CREATE CUSTOM SLOT
  // ===============================
  static async createCustomSlot(req: Request, res: Response) {
    try {
      const user = req.user as any; // from auth middleware

      if (!user || user.role !== "DOCTOR") {
        return res.status(403).json({
          message: "Only doctors can create slots",
        });
      }

      const {
        date,
        startTime,
        endTime,
        slotDuration,
        mode,
        maxPatientsPerSubSlot,
      } = req.body;

      // ===============================
      // BASIC VALIDATION
      // ===============================
      if (
        !date ||
        !startTime ||
        !endTime ||
        !slotDuration ||
        !mode
      ) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      if (!["STREAM", "WAVE"].includes(mode)) {
        return res.status(400).json({
          message: "Invalid slot mode",
        });
      }

      const result = await SlotService.createCustomSlot({
        doctorId: user.doctorId,
        date,
        startTime,
        endTime,
        slotDuration: Number(slotDuration),
        mode: mode as SlotMode,
        maxPatientsPerSubSlot: Number(maxPatientsPerSubSlot || 1),
      });

      return res.status(201).json({
        message: "Custom slot created successfully",
        data: result,
      });

    } catch (error: any) {
      console.error("Create Slot Error:", error);

      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }
}

static async getAvailableSlots(req: Request, res: Response) {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        message: "doctorId and date are required",
      });
    }

    const slots = await SlotService.getAvailableSlots({
      doctorId,
      date: date as string,
    });

    return res.status(200).json({
      message: "Available slots fetched",
      data: slots,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
static async createRecurringSlot(req: AuthRequest, res: Response) {
  try {
    const user = req.user;

    if (!user || user.role !== "DOCTOR" || !user.doctorId) {
      return res.status(403).json({
        message: "Only doctors can create recurring slots",
      });
    }

    const {
      daysOfWeek,
      startTime,
      endTime,
      slotDuration,
      mode,
      maxPatientsPerSubSlot,
      validFrom,
      validTill,
    } = req.body;

    if (!daysOfWeek || daysOfWeek.length === 0) {
      return res.status(400).json({
        message: "daysOfWeek is required",
      });
    }

    const result = await SlotService.createRecurringSlot({
      doctorId: user.doctorId,
      daysOfWeek,
      startTime,
      endTime,
      slotDuration,
      mode,
      maxPatientsPerSubSlot,
      validFrom,
      validTill,
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