"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const client_1 = require("@prisma/client");
class SlotService {
    // ===============================
    // CREATE RECURRING SLOT
    // ===============================
    static async createRecurringSlot(req, input) {
        const clinicId = req.clinicId;
        return db_1.default.recurringSlot.create({
            data: {
                clinicId,
                doctorId: input.doctorId,
                daysOfWeek: input.daysOfWeek,
                startTime: new Date(`1970-01-01T${input.startTime}:00Z`),
                endTime: new Date(`1970-01-01T${input.endTime}:00Z`),
                slotDuration: input.slotDuration,
                mode: input.mode,
                maxPatientsPerSubSlot: input.maxPatientsPerSubSlot,
                validFrom: new Date(`${input.validFrom}T00:00:00Z`),
                validTill: new Date(`${input.validTill}T00:00:00Z`),
            },
        });
    }
    // ===============================
    // GENERATE SLOTS FROM RECURRING
    // ===============================
    static async generateSlotsForDate(req, doctorId, date) {
        const clinicId = req.clinicId;
        const slotDate = new Date(`${date}T00:00:00Z`);
        const day = slotDate.getUTCDay();
        // OVERRIDE CHECK
        const override = await db_1.default.slot.findFirst({
            where: {
                clinicId,
                doctorId,
                date: slotDate,
                isOverride: true,
            },
        });
        if (override)
            return;
        const recurringSlots = await db_1.default.recurringSlot.findMany({
            where: {
                clinicId,
                doctorId,
                daysOfWeek: { has: day },
                validFrom: { lte: slotDate },
                validTill: { gte: slotDate },
            },
        });
        if (!recurringSlots.length)
            return;
        await db_1.default.slot.deleteMany({
            where: {
                clinicId,
                doctorId,
                date: slotDate,
                isOverride: false,
            },
        });
        for (const rec of recurringSlots) {
            const startTime = new Date(`${date}T${rec.startTime.toISOString().slice(11, 16)}:00Z`);
            const endTime = new Date(`${date}T${rec.endTime.toISOString().slice(11, 16)}:00Z`);
            const slot = await db_1.default.slot.create({
                data: {
                    clinicId,
                    doctorId,
                    date: slotDate,
                    startTime,
                    endTime,
                    slotDuration: rec.slotDuration,
                    type: client_1.SlotType.RECURRING,
                    mode: rec.mode,
                    maxPatientsPerSubSlot: rec.maxPatientsPerSubSlot,
                },
            });
            const subSlots = this.generateSubSlots({
                slotId: slot.id,
                clinicId,
                startTime,
                endTime,
                slotDuration: rec.slotDuration,
                mode: rec.mode,
                maxPatientsPerSubSlot: rec.maxPatientsPerSubSlot,
            });
            await db_1.default.subSlot.createMany({ data: subSlots });
        }
    }
    // ===============================
    // CREATE CUSTOM (OVERRIDE)
    // ===============================
    static async createCustomSlot(req, input) {
        const clinicId = req.clinicId;
        const slotDate = new Date(`${input.date}T00:00:00Z`);
        return db_1.default.$transaction(async (tx) => {
            await tx.subSlot.deleteMany({
                where: {
                    clinicId,
                    slot: {
                        doctorId: input.doctorId,
                        date: slotDate,
                    },
                },
            });
            await tx.slot.deleteMany({
                where: {
                    clinicId,
                    doctorId: input.doctorId,
                    date: slotDate,
                },
            });
            const slot = await tx.slot.create({
                data: {
                    clinicId,
                    doctorId: input.doctorId,
                    date: slotDate,
                    startTime: new Date(input.startTime),
                    endTime: new Date(input.endTime),
                    slotDuration: input.slotDuration,
                    type: client_1.SlotType.CUSTOM,
                    isOverride: true,
                    mode: input.mode,
                    maxPatientsPerSubSlot: input.maxPatientsPerSubSlot,
                },
            });
            const subSlots = this.generateSubSlots({
                slotId: slot.id,
                clinicId,
                startTime: new Date(input.startTime),
                endTime: new Date(input.endTime),
                slotDuration: input.slotDuration,
                mode: input.mode,
                maxPatientsPerSubSlot: input.maxPatientsPerSubSlot,
            });
            await tx.subSlot.createMany({ data: subSlots });
            return slot;
        });
    }
    // ===============================
    // GET AVAILABLE SLOTS
    // ===============================
    static async getAvailableSlots(req, doctorId, date) {
        const clinicId = req.clinicId;
        const slotDate = new Date(`${date}T00:00:00Z`);
        const now = new Date();
        await this.generateSlotsForDate(req, doctorId, date);
        return db_1.default.slot.findMany({
            where: {
                clinicId,
                doctorId,
                date: slotDate,
                isActive: true,
            },
            include: {
                subSlots: {
                    where: {
                        isFull: false,
                        startTime: { gt: now },
                    },
                    orderBy: { startTime: "asc" },
                },
            },
            orderBy: { startTime: "asc" },
        });
    }
    // ===============================
    // SUB SLOT GENERATOR
    // ===============================
    static generateSubSlots({ slotId, clinicId, startTime, endTime, slotDuration, mode, maxPatientsPerSubSlot, }) {
        const subSlots = [];
        let current = new Date(startTime);
        while (current < endTime) {
            const next = new Date(current.getTime() + slotDuration * 60000);
            if (next > endTime)
                break;
            subSlots.push({
                slotId,
                clinicId,
                startTime: new Date(current),
                endTime: new Date(next),
                currentBookings: 0,
                maxBookings: mode === "STREAM" ? 1 : maxPatientsPerSubSlot,
                isFull: false,
            });
            current = next;
        }
        return subSlots;
    }
}
exports.SlotService = SlotService;
