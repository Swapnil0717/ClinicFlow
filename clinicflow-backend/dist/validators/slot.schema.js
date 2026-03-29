"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlotSchema = void 0;
const zod_1 = require("zod");
exports.createSlotSchema = zod_1.z.object({
    doctorId: zod_1.z.string().uuid(),
    date: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    slotDuration: zod_1.z.number().min(5),
    mode: zod_1.z.enum(["STREAM", "WAVE"]),
    maxPatientsPerSubSlot: zod_1.z.number().min(1),
});
