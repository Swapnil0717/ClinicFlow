"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const db_1 = __importDefault(require("../../config/db"));
class PatientService {
    static async getDashboard(req) {
        const clinicId = req.clinicId;
        const patientId = req.user.userId;
        const appointments = await db_1.default.appointment.findMany({
            where: {
                clinicId,
                patientId,
            },
            include: {
                doctor: {
                    include: { user: true },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });
        return appointments;
    }
}
exports.PatientService = PatientService;
