"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const client_1 = require("@prisma/client");
class AppointmentService {
    static async bookAppointment({ patientId, subSlotId, clinicId, }) {
        return db_1.default.$transaction(async (tx) => {
            const subSlot = await tx.subSlot.findFirst({
                where: { id: subSlotId, clinicId },
            });
            if (!subSlot)
                throw new Error("Invalid slot");
            const existing = await tx.appointment.findFirst({
                where: { patientId, subSlotId, clinicId },
            });
            if (existing)
                throw new Error("Already booked");
            if (subSlot.isFull || subSlot.currentBookings >= subSlot.maxBookings) {
                throw new Error("Slot full");
            }
            const updated = await tx.subSlot.updateMany({
                where: {
                    id: subSlotId,
                    clinicId,
                    currentBookings: { lt: subSlot.maxBookings },
                },
                data: { currentBookings: { increment: 1 } },
            });
            if (updated.count === 0)
                throw new Error("Slot just filled");
            const finalSubSlot = await tx.subSlot.findUnique({
                where: { id: subSlotId },
            });
            if (finalSubSlot.currentBookings >= finalSubSlot.maxBookings) {
                await tx.subSlot.update({
                    where: { id: subSlotId },
                    data: { isFull: true },
                });
            }
            const slot = await tx.slot.findUnique({
                where: { id: finalSubSlot.slotId },
                select: { doctorId: true },
            });
            return tx.appointment.create({
                data: {
                    clinicId,
                    patientId,
                    doctorId: slot.doctorId,
                    subSlotId,
                    startTime: finalSubSlot.startTime,
                    endTime: finalSubSlot.endTime,
                    status: client_1.AppointmentStatus.BOOKED,
                },
            });
        });
    }
    static async cancelAppointment(req, appointmentId) {
        const clinicId = req.clinicId;
        const patientId = req.user.userId;
        const appointment = await db_1.default.appointment.findFirst({
            where: { id: appointmentId, clinicId },
        });
        if (!appointment)
            throw new Error("Not found");
        if (appointment.patientId !== patientId)
            throw new Error("Unauthorized");
        return db_1.default.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
    }
    static async getDoctorAppointments(req) {
        return db_1.default.appointment.findMany({
            where: {
                clinicId: req.clinicId,
                doctorId: req.user.doctorId,
            },
            include: { patient: true },
        });
    }
    static async getPatientAppointments(req) {
        return db_1.default.appointment.findMany({
            where: {
                clinicId: req.clinicId,
                patientId: req.user.userId,
            },
            include: { doctor: true },
        });
    }
}
exports.AppointmentService = AppointmentService;
