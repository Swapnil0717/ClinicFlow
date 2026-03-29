"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("./patient.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/dashboard", (0, auth_middleware_1.authMiddleware)(["PATIENT"]), patient_controller_1.PatientController.getDashboard);
exports.default = router;
