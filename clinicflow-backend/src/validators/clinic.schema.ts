import { z } from "zod";

export const createClinicSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
});