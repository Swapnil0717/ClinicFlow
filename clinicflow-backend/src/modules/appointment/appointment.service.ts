import { PrismaClient, AppointmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class AppointmentService {

  // ===============================
  // BOOK APPOINTMENT
  // ===============================
  static async bookAppointment({
    patientId,
    subSlotId,
  }: {
    patientId: string;
    subSlotId: string;
  }) {

    return await prisma.$transaction(async (tx) => {

      // ===============================
      // 1. GET SUB SLOT
      // ===============================
      const subSlot = await tx.subSlot.findUnique({
        where: { id: subSlotId },
      });

      if (!subSlot) {
        throw new Error("SubSlot not found");
      }

      // ===============================
      // 2. CHECK FULL
      // ===============================
      if (subSlot.isFull || subSlot.currentBookings >= subSlot.maxBookings) {
        throw new Error("Slot is already full");
      }

      // ===============================
      // 3. ATOMIC UPDATE (CRITICAL)
      // ===============================
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

      // If no row updated → race condition happened
      if (updated.count === 0) {
        throw new Error("Slot just got full, try another");
      }

      // ===============================
      // 4. MARK FULL IF NEEDED
      // ===============================
      const finalSubSlot = await tx.subSlot.findUnique({
        where: { id: subSlotId },
      });

      if (finalSubSlot!.currentBookings >= finalSubSlot!.maxBookings) {
        await tx.subSlot.update({
          where: { id: subSlotId },
          data: { isFull: true },
        });
      }

      // ===============================
      // 5. GET DOCTOR ID
      // ===============================
      const slot = await tx.slot.findUnique({
        where: { id: finalSubSlot!.slotId },
        select: { doctorId: true },
      });

      // ===============================
      // 6. CREATE APPOINTMENT
      // ===============================
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: slot!.doctorId,
          subSlotId,
          status: AppointmentStatus.BOOKED,
        },
      });

      return appointment;
    });
  }
}