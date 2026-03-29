"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const patient_service_1 = require("./patient.service");
class PatientController {
    static async getDashboard(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== "PATIENT") {
                return res.status(403).json({
                    message: "Only patients can access dashboard",
                });
            }
            const data = await patient_service_1.PatientService.getDashboard(user.userId);
            return res.status(200).json({
                message: "Patient dashboard fetched",
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}
exports.PatientController = PatientController;
