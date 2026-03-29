import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { SlotService } from "../modules/slots/slot.service";

const prisma = new PrismaClient();

cron.schedule("0 0 * * *", async () => {
  console.log("Running slot generation cron...");

  const today = new Date();
  const futureDays = 14;

  const recurringSlots = await prisma.recurringSlot.findMany();

  for (const rs of recurringSlots) {

    for (let i = 0; i < futureDays; i++) {

      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      const day = currentDate.getDay();

      if (
        currentDate < rs.validFrom ||
        currentDate > rs.validTill
      ) continue;

      if (!rs.daysOfWeek.includes(day)) continue;

      const date = new Date(
        currentDate.toISOString().split("T")[0] + "T00:00:00.000Z"
      );

      const override = await prisma.slot.findFirst({
        where: {
          doctorId: rs.doctorId,
          date,
          isOverride: true,
        },
      });

      if (override) continue;

      const existing = await prisma.slot.findFirst({
        where: {
          doctorId: rs.doctorId,
          date,
        },
      });

      if (existing) continue;

      const slot = await prisma.slot.create({
        data: {
          doctorId: rs.doctorId,
          clinicId: rs.clinicId, // ✅ FIXED
          date,
          startTime: new Date(`${date.toISOString().split("T")[0]}T${rs.startTime.toISOString().split("T")[1]}`),
          endTime: new Date(`${date.toISOString().split("T")[0]}T${rs.endTime.toISOString().split("T")[1]}`),
          slotDuration: rs.slotDuration,
          type: "RECURRING",
          mode: rs.mode,
          maxPatientsPerSubSlot: rs.maxPatientsPerSubSlot,
        },
      });

      const subSlots = SlotService.generateSubSlots({
        slotId: slot.id,
        clinicId: rs.clinicId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotDuration: rs.slotDuration,
        mode: rs.mode,
        maxPatientsPerSubSlot: rs.maxPatientsPerSubSlot,
      });

      await prisma.subSlot.createMany({ data: subSlots });
    }
  }
});