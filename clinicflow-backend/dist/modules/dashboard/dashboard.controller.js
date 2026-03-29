"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
class DashboardController {
    // ======================================
    // 🩺 DOCTOR DASHBOARD (SaaS + Analytics)
    // ======================================
    static async getDoctorDashboard(req, res) {
        try {
            const user = req.user;
            // 🔐 AUTH CHECK
            if (!user || user.role !== "DOCTOR") {
                return res.status(403).json({
                    message: "Only doctors can access this dashboard",
                });
            }
            if (!user.doctorId || !user.clinicId) {
                return res.status(400).json({
                    message: "Doctor is not properly assigned to clinic",
                });
            }
            const data = await dashboard_service_1.DashboardService.getDoctorDashboard({
                doctorId: user.doctorId,
                clinicId: user.clinicId,
            });
            return res.status(200).json({
                success: true,
                message: "Doctor dashboard fetched successfully",
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch doctor dashboard",
            });
        }
    }
    // ======================================
    // 👤 PATIENT DASHBOARD (SaaS SAFE)
    // ======================================
    static async getPatientDashboard(req, res) {
        try {
            const user = req.user;
            // 🔐 AUTH CHECK
            if (!user || user.role !== "PATIENT") {
                return res.status(403).json({
                    message: "Only patients can access this dashboard",
                });
            }
            const data = await dashboard_service_1.DashboardService.getPatientDashboard({
                patientId: user.userId,
                clinicId: user.clinicId, // can be null (allowed)
            });
            return res.status(200).json({
                success: true,
                message: "Patient dashboard fetched successfully",
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch patient dashboard",
            });
        }
    }
    // ======================================
    // 🏥 ADMIN / CLINIC DASHBOARD (BONUS)
    // ======================================
    static async getClinicDashboard(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== "ADMIN") {
                return res.status(403).json({
                    message: "Only admins can access clinic dashboard",
                });
            }
            if (!user.clinicId) {
                return res.status(400).json({
                    message: "Admin is not linked to any clinic",
                });
            }
            const data = await dashboard_service_1.DashboardService.getClinicDashboard({
                clinicId: user.clinicId,
            });
            return res.status(200).json({
                success: true,
                message: "Clinic dashboard fetched successfully",
                data,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch clinic dashboard",
            });
        }
    }
}
exports.DashboardController = DashboardController;
