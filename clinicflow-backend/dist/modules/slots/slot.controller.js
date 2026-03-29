"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotController = void 0;
const slot_service_1 = require("./slot.service");
class SlotController {
    // ===============================
    // CREATE CUSTOM SLOT
    // ===============================
    static async createCustomSlot(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== "DOCTOR") {
                return res.status(403).json({
                    message: "Only doctors can create slots",
                });
            }
            const result = await slot_service_1.SlotService.createCustomSlot(req, {
                doctorId: user.doctorId,
                ...req.body,
            });
            return res.status(201).json({
                message: "Custom slot created",
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    // ===============================
    // GET AVAILABLE SLOTS
    // ===============================
    static async getAvailableSlots(req, res) {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;
            const result = await slot_service_1.SlotService.getAvailableSlots(req, doctorId, date);
            return res.status(200).json({
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    // ===============================
    // CREATE RECURRING SLOT
    // ===============================
    static async createRecurringSlot(req, res) {
        try {
            const user = req.user;
            if (!user || user.role !== "DOCTOR") {
                return res.status(403).json({
                    message: "Only doctors allowed",
                });
            }
            const result = await slot_service_1.SlotService.createRecurringSlot({
                doctorId: user.doctorId,
                ...req.body,
            });
            return res.status(201).json({
                message: "Recurring slot created",
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}
exports.SlotController = SlotController;
