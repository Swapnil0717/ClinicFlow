import prisma from "../../config/db";
import { AppointmentStatus } from "@prisma/client";
import {
  DoctorDashboardInput,
  PatientDashboardInput,
  ClinicDashboardInput,
} from "./dashboard.types";

export class DashboardService {

  // ======================================
  // 🩺 DOCTOR DASHBOARD
  // ======================================
  static async getDoctorDashboard({ doctorId, clinicId }: DoctorDashboardInput) {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [appointments, totalPatients] = await Promise.all([
      prisma.appointment.findMany({
        where: { doctorId, clinicId },
        orderBy: { date: "asc" },
      }),

      prisma.appointment.count({
        where: { doctorId, clinicId },
        distinct: ["patientId"],
      }),
    ]);

    const summary = {
      totalAppointments: appointments.length,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
      totalPatients,
    };

    const todayAppointments: any[] = [];

    for (const a of appointments) {
      if (a.status === AppointmentStatus.COMPLETED) summary.completed++;
      else if (a.status === AppointmentStatus.CANCELLED) summary.cancelled++;

      if (a.status === AppointmentStatus.CONFIRMED && a.date > now) {
        summary.upcoming++;
      }

      if (a.date >= todayStart && a.date <= todayEnd) {
        todayAppointments.push(a);
      }
    }

    return {
      summary,
      todayAppointments,
    };
  }

  // ======================================
  // 👤 PATIENT DASHBOARD
  // ======================================
  static async getPatientDashboard({ userId, clinicId }: PatientDashboardInput) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const now = new Date();

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        ...(clinicId ? { clinicId } : {}),
      },
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { date: "asc" },
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
        time: a.date,
        status: a.status,
      };

      if (a.status === AppointmentStatus.CONFIRMED && a.date > now) {
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

  // ======================================
  // 🏥 CLINIC DASHBOARD (ADMIN)
  // ======================================
  static async getClinicDashboard({ clinicId }: ClinicDashboardInput) {

    const [appointmentsCount, doctorsCount, patientsCount] =
      await Promise.all([
        prisma.appointment.count({ where: { clinicId } }),

        prisma.doctor.count({
          where: { clinicId },
        }),

        prisma.patient.count({
          where: { clinicId }, // ✅ SaaS SAFE FIX
        }),
      ]);

    return {
      totalAppointments: appointmentsCount,
      totalDoctors: doctorsCount,
      totalPatients: patientsCount,
    };
  }
}