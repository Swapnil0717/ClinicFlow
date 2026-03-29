import prisma from "../../config/db";

export const verifyClinic = async (clinicId: string) => {
  return prisma.clinic.update({
    where: { id: clinicId },
    data: { isVerified: true },
  });
};

export const verifyDoctor = async (doctorId: string) => {
  return prisma.doctor.update({
    where: { id: doctorId },
    data: { isVerified: true },
  });
};

export const getPendingClinics = async () => {
  return prisma.clinic.findMany({
    where: { isVerified: false },
  });
};

export const getPendingDoctors = async () => {
  return prisma.doctor.findMany({
    where: { isVerified: false },
    include: { user: true, clinic: true },
  });
};

export const rejectClinic = async (
  clinicId: string,
  reason: string
) => {

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
    include: {
      owner: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  // 📧 Send rejection email
  try {
    await sendEmail(
      clinic.owner.email,
      "❌ Clinic Rejected",
      `
      <h2>Hello ${clinic.owner.name}</h2>
      <p>Your clinic <b>${clinic.name}</b> has been rejected.</p>
      <p><b>Reason:</b> ${reason}</p>
      <p>You can fix the issue and contact support.</p>
      `
    );
  } catch (err) {
    console.error("Email failed:", err);
  }

  return clinic;
};

export const becomeAdmin = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("User not found");

  if (user.role === "ADMIN") {
    throw new Error("User is already an admin");
  }

  // ✅ Update role to ADMIN
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      role: "ADMIN",
    },
  });

  return updated;
};