import prisma from "../../config/db";
import { sendEmail } from "../../utils/emailService";

export class ClinicService {

  //////////////////////////////
  // VERIFY CLINIC
  //////////////////////////////
  static async verifyClinic(clinicId: string) {
    const clinic = await prisma.clinic.update({
      where: { id: clinicId },
      data: { isVerified: true, rejected: false },
      include: { owner: true },
    });

    await sendEmail(
      clinic.owner.email,
      "🏥 Clinic Approved",
      `
      <h2>Hello ${clinic.owner.name}</h2>
      <p>Your clinic <b>${clinic.name}</b> has been approved.</p>
      `
    );

    return clinic;
  }

  //////////////////////////////
  // ❌ REJECT CLINIC (NEW)
  //////////////////////////////
  static async rejectClinic(clinicId: string, reason: string) {

    if (!reason) {
      throw new Error("Rejection reason is required");
    }

    const clinic = await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        rejected: true,
        rejectionReason: reason,
        isVerified: false,
      },
      include: { owner: true },
    });

    await sendEmail(
      clinic.owner.email,
      "❌ Clinic Rejected",
      `
      <h2>Hello ${clinic.owner.name}</h2>
      <p>Your clinic <b>${clinic.name}</b> has been rejected.</p>
      <p><b>Reason:</b> ${reason}</p>
      `
    );

    return clinic;
  }
}