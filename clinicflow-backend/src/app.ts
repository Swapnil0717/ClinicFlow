import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes";
import doctorRoutes from "./modules/doctor/doctor.routes";
import appointmentRoutes from "./modules/appointment/appointment.routes";
import clinicRoutes from "./modules/clinic/clinic.routes";
import searchRoutes from "./modules/search/search.routes";
import slotRoutes from "./modules/slots/slot.routes";
import adminRoutes from "./modules/admin/admin.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

// 🔐 Security
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// 🔥 Global Rate Limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// 🔥 Strict Rate Limit for Auth
app.use("/api/v1/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
}));

// 📦 Body parser
app.use(express.json());

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/slots", slotRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin", adminRoutes);

// 🩺 Health Check
app.get("/", (req, res) => {
  res.send("ClinicFlow API 🚀");
});

// ❌ Error handler (MUST BE LAST)
app.use(errorHandler);

// ✅ EXPORT ONLY (NO LISTEN HERE)
export default app;