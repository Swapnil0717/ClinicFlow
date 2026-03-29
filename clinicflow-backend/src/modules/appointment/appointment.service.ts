import prisma from "../../config/db";
import { AppointmentStatus } from "@prisma/client";

export class AppointmentService {

  // ================================
  // 📅 BOOK APPOINTMENT
  // ================================
  static async bookAppointment({
    patientId,
    subSlotId,
  }: {
    patientId: string;
    subSlotId: string;
  }) {
    return prisma.$transaction(async (tx) => {

      const subSlot = await tx.subSlot.findUnique({
        where: { id: subSlotId },
        include: { slot: true },
      });

      if (!subSlot) throw new Error("Invalid slot");

      const clinicId = subSlot.slot.clinicId;
      const doctorId = subSlot.slot.doctorId;

      const existing = await tx.appointment.findFirst({
        where: {
          patientId,
          subSlotId,
          status: AppointmentStatus.CONFIRMED,
        },
      });

      if (existing) throw new Error("Already booked this slot");

      if (subSlot.isFull || subSlot.currentBookings >= subSlot.maxBookings) {
        throw new Error("Slot is full");
      }

      const updated = await tx.subSlot.updateMany({
        where: {
          id: subSlotId,
          currentBookings: {
            lt: subSlot.maxBookings,
          },
        },
        data: {
          currentBookings: {
            increment: 1,
          },
        },
      });

      if (updated.count === 0) {
        throw new Error("Slot just got full");
      }

      const finalSubSlot = await tx.subSlot.findUnique({
        where: { id: subSlotId },
      });

      if (!finalSubSlot) throw new Error("Slot not found");

      if (finalSubSlot.currentBookings >= finalSubSlot.maxBookings) {
        await tx.subSlot.update({
          where: { id: subSlotId },
          data: { isFull: true },
        });
      }

      return tx.appointment.create({
        data: {
          clinicId,
          patientId,
          doctorId,
          subSlotId,
          startTime: finalSubSlot.startTime,
          endTime: finalSubSlot.endTime,
          status: AppointmentStatus.CONFIRMED,
        },
      });
    });
  }

  // ================================
  // 👤 PATIENT APPOINTMENTS
  // ================================
  static async getPatientAppointments(patientId: string) {
    return prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        clinic: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  // ================================
  // 🩺 DOCTOR APPOINTMENTS
  // ================================
  static async getDoctorAppointments(
    doctorId: string,
    clinicId: string
  ) {
    return prisma.appointment.findMany({
      where: {
        doctorId,
        clinicId,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  // ================================
  // ❌ PATIENT CANCEL
  // ================================
  static async cancelAppointment({
    appointmentId,
    patientId,
  }: {
    appointmentId: string;
    patientId: string;
  }) {
    return prisma.$transaction(async (tx) => {

      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) throw new Error("Appointment not found");

      if (appointment.patientId !== patientId) {
        throw new Error("Unauthorized");
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new Error("Already cancelled");
      }

      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancelledBy: "PATIENT",
          cancelledAt: new Date(),
        },
      });

      await tx.subSlot.update({
        where: { id: appointment.subSlotId },
        data: {
          currentBookings: { decrement: 1 },
          isFull: false,
        },
      });

      return updated;
    });
  }

  // ================================
  // 🩺 DOCTOR CANCEL
  // ================================
  static async cancelAppointmentByDoctor({
    appointmentId,
    doctorId,
  }: {
    appointmentId: string;
    doctorId: string;
  }) {
    return prisma.$transaction(async (tx) => {

      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) throw new Error("Appointment not found");

      if (appointment.doctorId !== doctorId) {
        throw new Error("Unauthorized");
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new Error("Already cancelled");
      }

      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancelledBy: "DOCTOR",
          cancelledAt: new Date(),
        },
      });

      await tx.subSlot.update({
        where: { id: appointment.subSlotId },
        data: {
          currentBookings: { decrement: 1 },
          isFull: false,
        },
      });

      return updated;
    });
  }
}