import { PrismaClient, SlotMode, SlotType } from "@prisma/client";

const prisma = new PrismaClient();

export class SlotService {

  // ===============================
  // CREATE CUSTOM SLOT
  // ===============================
  static async createCustomSlot(input: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    mode: SlotMode;
    maxPatientsPerSubSlot: number;
  }) {
    const {
      doctorId,
      date,
      startTime,
      endTime,
      slotDuration,
      mode,
      maxPatientsPerSubSlot,
    } = input;

    // 🔹 Normalize date (00:00 UTC)
    const slotDate = new Date(`${date}T00:00:00.000Z`);

    const startDateTime = new Date(`${date}T${startTime}:00.000Z`);
    const endDateTime = new Date(`${date}T${endTime}:00.000Z`);

    if (startDateTime >= endDateTime) {
      throw new Error("Start time must be before end time");
    }

    // ===============================
    // TRANSACTION START
    // ===============================
    return await prisma.$transaction(async (tx) => {

      // ===============================
      // 1. DELETE EXISTING SLOTS (OVERRIDE LOGIC)
      // ===============================
      await tx.subSlot.deleteMany({
        where: {
          slot: {
            doctorId,
            date: slotDate,
          },
        },
      });

      await tx.slot.deleteMany({
        where: {
          doctorId,
          date: slotDate,
        },
      });

      // ===============================
      // 2. CREATE SLOT
      // ===============================
      const slot = await tx.slot.create({
        data: {
          doctorId,
          date: slotDate,
          startTime: startDateTime,
          endTime: endDateTime,
          slotDuration,
          type: SlotType.CUSTOM,
          isOverride: true,
          mode,
          maxPatientsPerSubSlot,
        },
      });

      // ===============================
      // 3. GENERATE SUB-SLOTS
      // ===============================
      const subSlots = this.generateSubSlots({
        slotId: slot.id,
        startTime: startDateTime,
        endTime: endDateTime,
        slotDuration,
        mode,
        maxPatientsPerSubSlot,
      });

      // ===============================
      // 4. BULK INSERT SUB-SLOTS
      // ===============================
      await tx.subSlot.createMany({
        data: subSlots,
      });

      return {
        slot,
        subSlotsCount: subSlots.length,
      };
    });
  }

  // ===============================
  // SUB-SLOT GENERATOR
  // ===============================
  private static generateSubSlots({
    slotId,
    startTime,
    endTime,
    slotDuration,
    mode,
    maxPatientsPerSubSlot,
  }: {
    slotId: string;
    startTime: Date;
    endTime: Date;
    slotDuration: number;
    mode: SlotMode;
    maxPatientsPerSubSlot: number;
  }) {

    const subSlots = [];

    let currentStart = new Date(startTime);

    while (currentStart < endTime) {
      const currentEnd = new Date(currentStart.getTime() + slotDuration * 60000);

      if (currentEnd > endTime) break;

      subSlots.push({
        slotId,
        startTime: new Date(currentStart),
        endTime: new Date(currentEnd),
        currentBookings: 0,
        maxBookings: mode === "STREAM" ? 1 : maxPatientsPerSubSlot,
        isFull: false,
      });

      currentStart = currentEnd;
    }

    return subSlots;
  }
}
static async getAvailableSlots({
  doctorId,
  date,
}: {
  doctorId: string;
  date: string;
}) {
  const slotDate = new Date(`${date}T00:00:00.000Z`);
  const now = new Date();

  // ===============================
  // 1. CHECK CUSTOM OVERRIDE
  // ===============================
  const customSlots = await prisma.slot.findMany({
    where: {
      doctorId,
      date: slotDate,
      isOverride: true,
      isActive: true,
    },
    include: {
      subSlots: {
        where: {
          isFull: false,
          startTime: {
            gt: now,
          },
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  // If custom exists → return them only
  if (customSlots.length > 0) {
    return customSlots;
  }

  // ===============================
  // 2. RETURN NORMAL (RECURRING)
  // ===============================
  const slots = await prisma.slot.findMany({
    where: {
      doctorId,
      date: slotDate,
      isActive: true,
    },
    include: {
      subSlots: {
        where: {
          isFull: false,
          startTime: {
            gt: now,
          },
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return slots;
}
static async createRecurringSlot(input: {
  doctorId: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  mode: "STREAM" | "WAVE";
  maxPatientsPerSubSlot: number;
  validFrom: string;
  validTill: string;
}) {
  const {
    doctorId,
    daysOfWeek,
    startTime,
    endTime,
    slotDuration,
    mode,
    maxPatientsPerSubSlot,
    validFrom,
    validTill,
  } = input;

  return await prisma.recurringSlot.create({
    data: {
      doctorId,
      daysOfWeek,
      startTime: new Date(`1970-01-01T${startTime}:00Z`),
      endTime: new Date(`1970-01-01T${endTime}:00Z`),
      slotDuration,
      mode,
      maxPatientsPerSubSlot,
      validFrom: new Date(`${validFrom}T00:00:00.000Z`),
      validTill: new Date(`${validTill}T00:00:00.000Z`),
    },
  });
}