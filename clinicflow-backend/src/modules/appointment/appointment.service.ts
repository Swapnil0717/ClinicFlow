import prisma from "../../config/db";
import { AppointmentStatus } from "@prisma/client";

export class AppointmentService {

  static async bookAppointment(req: any, subSlotId: string) {
    const clinicId = req.clinicId;
    const patientId = req.user.userId;

    return prisma.$transaction(async (tx) => {

      const subSlot = await tx.subSlot.findFirst({
        where: { id: subSlotId, clinicId },
      });

      if (!subSlot) throw new Error("Invalid slot");

      const existing = await tx.appointment.findFirst({
        where: { patientId, subSlotId, clinicId },
      });

      if (existing) throw new Error("Already booked");

      if (subSlot.isFull || subSlot.currentBookings >= subSlot.maxBookings) {
        throw new Error("Slot full");
      }

      const updated = await tx.subSlot.updateMany({
        where: {
          id: subSlotId,
          clinicId,
          currentBookings: { lt: subSlot.maxBookings },
        },
        data: { currentBookings: { increment: 1 } },
      });

      if (updated.count === 0) throw new Error("Slot just filled");

      const finalSubSlot = await tx.subSlot.findUnique({
        where: { id: subSlotId },
      });

      if (finalSubSlot!.currentBookings >= finalSubSlot!.maxBookings) {
        await tx.subSlot.update({
          where: { id: subSlotId },
          data: { isFull: true },
        });
      }

      const slot = await tx.slot.findFirst({
        where: { id: finalSubSlot!.slotId, clinicId },
        select: { doctorId: true },
      });

      return tx.appointment.create({
        data: {
          clinicId,
          patientId,
          doctorId: slot!.doctorId,
          subSlotId,
          startTime: finalSubSlot!.startTime,
          endTime: finalSubSlot!.endTime,
          status: AppointmentStatus.BOOKED,
        },
      });
    });
  }

  static async cancelAppointment(req: any, appointmentId: string) {
    const clinicId = req.clinicId;
    const patientId = req.user.userId;

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) throw new Error("Not found");
    if (appointment.patientId !== patientId) throw new Error("Unauthorized");

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  static async getDoctorAppointments(req: any) {
    return prisma.appointment.findMany({
      where: {
        clinicId: req.clinicId,
        doctorId: req.user.userId,
      },
      include: { patient: true },
    });
  }

  static async getPatientAppointments(req: any) {
    return prisma.appointment.findMany({
      where: {
        clinicId: req.clinicId,
        patientId: req.user.userId,
      },
      include: { doctor: true },
    });
  }
}