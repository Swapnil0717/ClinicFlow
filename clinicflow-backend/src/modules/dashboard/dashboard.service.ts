import prisma from "../../config/db";
import { AppointmentStatus } from "@prisma/client";

export class DashboardService {

  // ===============================
  // DOCTOR DASHBOARD
  // ===============================
  static async getDoctorDashboard(req: any) {
    const clinicId = req.clinicId;
    const doctorId = req.user.userId;

    const now = new Date();
    const today = new Date().toISOString().split("T")[0];

    const appointments = await prisma.appointment.findMany({
      where: { clinicId, doctorId },
      orderBy: { startTime: "asc" },
    });

    const patients = await prisma.appointment.findMany({
      where: { clinicId, doctorId },
      distinct: ["patientId"],
    });

    let summary = {
      totalAppointments: appointments.length,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
      totalPatients: patients.length,
    };

    const todayAppointments: any[] = [];

    for (const a of appointments) {
      if (a.status === AppointmentStatus.COMPLETED) summary.completed++;
      else if (a.status === AppointmentStatus.CANCELLED) summary.cancelled++;

      if (a.startTime > now && a.status === AppointmentStatus.BOOKED) {
        summary.upcoming++;
      }

      if (a.startTime.toISOString().startsWith(today)) {
        todayAppointments.push(a);
      }
    }

    return {
      summary,
      todayAppointments,
    };
  }

  // ===============================
  // PATIENT DASHBOARD
  // ===============================
  static async getPatientDashboard(req: any) {
    const clinicId = req.clinicId;
    const patientId = req.user.userId;
    const now = new Date();

    const appointments = await prisma.appointment.findMany({
      where: { clinicId, patientId },
      include: {
        doctor: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    const summary = {
      total: appointments.length,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
    };

    const upcoming: any[] = [];
    const history: any[] = [];

    for (const a of appointments) {
      if (a.status === AppointmentStatus.COMPLETED) summary.completed++;
      else if (a.status === AppointmentStatus.CANCELLED) summary.cancelled++;

      const formatted = {
        id: a.id,
        doctorName: a.doctor.user.name,
        time: a.startTime,
        status: a.status,
      };

      if (a.startTime > now && a.status === AppointmentStatus.BOOKED) {
        summary.upcoming++;
        upcoming.push(formatted);
      } else {
        history.push(formatted);
      }
    }

    return {
      summary,
      upcoming,
      history,
    };
  }
}