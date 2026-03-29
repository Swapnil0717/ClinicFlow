"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const client_1 = require("@prisma/client");
class DashboardService {
    static async getDoctorDashboard(req) {
        const clinicId = req.clinicId;
        const doctorId = req.user.doctorId;
        const now = new Date();
        const today = new Date().toISOString().split("T")[0];
        const appointments = await db_1.default.appointment.findMany({
            where: { clinicId, doctorId },
            orderBy: { startTime: "asc" },
        });
        const patients = await db_1.default.appointment.findMany({
            where: { clinicId, doctorId },
            distinct: ["patientId"],
        });
        let summary = {
            totalAppointments: appointments.length,
            upcoming: 0,
            completed: 0,
            cancelled: 0,
            totalPatients: patients.length,
        };
        const todayAppointments = [];
        for (const a of appointments) {
            if (a.status === client_1.AppointmentStatus.COMPLETED)
                summary.completed++;
            else if (a.status === client_1.AppointmentStatus.CANCELLED)
                summary.cancelled++;
            if (a.startTime > now && a.status === client_1.AppointmentStatus.BOOKED) {
                summary.upcoming++;
            }
            if (a.startTime.toISOString().startsWith(today)) {
                todayAppointments.push(a);
            }
        }
        return {
            summary,
            todayAppointments,
        };
    }
    static async getPatientDashboard(req) {
        const clinicId = req.clinicId;
        const patientId = req.user.userId;
        const now = new Date();
        const appointments = await db_1.default.appointment.findMany({
            where: { clinicId, patientId },
            include: {
                doctor: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
            },
            orderBy: { startTime: "asc" },
        });
        const summary = {
            total: appointments.length,
            upcoming: 0,
            completed: 0,
            cancelled: 0,
        };
        const upcoming = [];
        const history = [];
        for (const a of appointments) {
            if (a.status === client_1.AppointmentStatus.COMPLETED)
                summary.completed++;
            else if (a.status === client_1.AppointmentStatus.CANCELLED)
                summary.cancelled++;
            const formatted = {
                id: a.id,
                doctorName: a.doctor.user.name,
                time: a.startTime,
                status: a.status,
            };
            if (a.startTime > now && a.status === client_1.AppointmentStatus.BOOKED) {
                summary.upcoming++;
                upcoming.push(formatted);
            }
            else {
                history.push(formatted);
            }
        }
        return {
            summary,
            upcoming,
            history,
        };
    }
}
exports.DashboardService = DashboardService;
