export type CreateCustomSlotInput = {
    doctorId: string;
    date: string; // "2026-03-25"
    startTime: string; // "09:00"
    endTime: string;   // "12:00"
    slotDuration: number;
    mode: "STREAM" | "WAVE";
    maxPatientsPerSubSlot: number;
  };