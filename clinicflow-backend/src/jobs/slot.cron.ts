import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

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

      // Check valid range
      if (
        currentDate < rs.validFrom ||
        currentDate > rs.validTill
      ) continue;

      // Check day match
      if (!rs.daysOfWeek.includes(day)) continue;

      const date = new Date(
        currentDate.toISOString().split("T")[0] + "T00:00:00.000Z"
      );

      // Check override exists
      const override = await prisma.slot.findFirst({
        where: {
          doctorId: rs.doctorId,
          date,
          isOverride: true,
        },
      });

      if (override) continue;

      // Prevent duplicate
      const existing = await prisma.slot.findFirst({
        where: {
          doctorId: rs.doctorId,
          date,
          startTime: {
            gte: new Date(`${date.toISOString().split("T")[0]}T00:00:00Z`),
          },
        },
      });

      if (existing) continue;

      // Create slot
      const slot = await prisma.slot.create({
        data: {
          doctorId: rs.doctorId,
          date,
          startTime: new Date(`${date.toISOString().split("T")[0]}T${rs.startTime.toISOString().split("T")[1]}`),
          endTime: new Date(`${date.toISOString().split("T")[0]}T${rs.endTime.toISOString().split("T")[1]}`),
          slotDuration: rs.slotDuration,
          type: "RECURRING",
          mode: rs.mode,
          maxPatientsPerSubSlot: rs.maxPatientsPerSubSlot,
        },
      });

      // Generate subSlots (reuse your function)
      const subSlots = SlotService["generateSubSlots"]({
        slotId: slot.id,
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