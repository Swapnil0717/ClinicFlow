"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
// 🩺 Doctor Dashboard
router.get("/doctor", (0, auth_middleware_1.authMiddleware)(["DOCTOR"]), dashboard_controller_1.DashboardController.getDoctorDashboard);
// 👤 Patient Dashboard
router.get("/patient", (0, auth_middleware_1.authMiddleware)(["PATIENT"]), dashboard_controller_1.DashboardController.getPatientDashboard);
// 🏥 Clinic Dashboard (Admin)
router.get("/clinic", (0, auth_middleware_1.authMiddleware)(["ADMIN"]), dashboard_controller_1.DashboardController.getClinicDashboard);
exports.default = router;
