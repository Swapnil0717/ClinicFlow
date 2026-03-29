"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const clinic_controller_1 = require("./clinic.controller");
const router = (0, express_1.Router)();
router.post("/", (0, auth_middleware_1.authMiddleware)(["PATIENT", "ADMIN"]), clinic_controller_1.ClinicController.createClinic);
exports.default = router;
