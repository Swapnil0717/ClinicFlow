import { z } from "zod";

export const createSlotSchema = z.object({
  doctorId: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  slotDuration: z.number().min(5),
  mode: z.enum(["STREAM", "WAVE"]),
  maxPatientsPerSubSlot: z.number().min(1),
});