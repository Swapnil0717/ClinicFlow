import prisma from "../../config/db";
import { hashPassword } from "../../utils/hashPassword";

export const createDoctor = async (req: any, data: any) => {
  const clinicId = req.clinicId;

  return prisma.$transaction(async (tx) => {

    const existing = await tx.user.findUnique({
      where: { email: data.email },
    });

    if (existing) throw new Error("User exists");

    const hashedPassword = await hashPassword(data.password);

    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "DOCTOR",
        clinicId,
        isEmailVerified: true,
      },
    });

    const doctor = await tx.doctor.create({
      data: {
        userId: user.id,
        clinicId,
        specialization: data.specialization,
        experience: data.experience,
        consultationFee: data.consultationFee,
      },
    });

    return { user, doctor };
  });
};

export const getAllDoctors = async (req: any) => {
  return prisma.doctor.findMany({
    where: { clinicId: req.clinicId },
    include: { user: true },
  });
};

export const getDoctorById = async (req: any, doctorId: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      id: doctorId,
      clinicId: req.clinicId,
    },
    include: { user: true },
  });

  if (!doctor) throw new Error("Not found");

  return doctor;
};