"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const doctor_routes_1 = __importDefault(require("./modules/doctor/doctor.routes"));
const appointment_routes_1 = __importDefault(require("./modules/appointment/appointment.routes"));
const clinic_routes_1 = __importDefault(require("./modules/clinic/clinic.routes"));
const search_routes_1 = __importDefault(require("./modules/search/search.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const slot_routes_1 = __importDefault(require("./modules/slots/slot.routes"));
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
app.use(express_1.default.json());
// Routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/doctors", doctor_routes_1.default);
app.use("/api/v1/appointments", appointment_routes_1.default);
app.use("/api/v1/clinics", clinic_routes_1.default);
app.use("/api/v1/slots", slot_routes_1.default);
app.use("/api/v1/search", search_routes_1.default);
// Health
app.get("/", (req, res) => {
    res.send("ClinicFlow API 🚀");
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
