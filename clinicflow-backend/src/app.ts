import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import doctorRoutes from "./modules/doctor/doctor.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ClinicFlow API Running 🚀");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctors", doctorRoutes);

export default app;