import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes";
import doctorRoutes from "./modules/doctor/doctor.routes";
import appointmentRoutes from "./modules/appointment/appointment.routes";
import clinicRoutes from "./modules/clinic/clinic.routes";
import searchRoutes from "./modules/search/search.routes";
import { errorHandler } from "./middleware/error.middleware";
import slotRoutes from "./modules/slots/slot.routes";

const app = express();

// Security
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/slots", slotRoutes);
app.use("/api/v1/search", searchRoutes);

// Health
app.get("/", (req, res) => {
  res.send("ClinicFlow API 🚀");
});

// Global Error Handler
app.use(errorHandler);

export default app;