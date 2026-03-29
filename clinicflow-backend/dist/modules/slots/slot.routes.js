"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slot_controller_1 = require("./slot.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ===============================
// CREATE CUSTOM SLOT
// ===============================
router.post("/custom", (0, auth_middleware_1.authMiddleware)(["DOCTOR"]), slot_controller_1.SlotController.createCustomSlot);
// ===============================
// CREATE RECURRING SLOT
// ===============================
router.post("/recurring", (0, auth_middleware_1.authMiddleware)(["DOCTOR"]), slot_controller_1.SlotController.createRecurringSlot);
// ===============================
// GET AVAILABLE SLOTS
// ===============================
router.get("/:doctorId", slot_controller_1.SlotController.getAvailableSlots);
exports.default = router;
