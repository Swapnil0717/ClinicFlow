import prisma from "../../config/db";
import { hashPassword } from "../../utils/hashPassword";

// ✅ CREATE DOCTOR (ADMIN)
export const createDoctor = async (data: {
  name: string;
  email: string;
  password: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  clinicName?: string;
  clinicAddress?: string;
}) => {
  const {
    name,
    email,
    password,
    specialization,
    experience,
    consultationFee,
    clinicName,
    clinicAddress,
  } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user + doctor in transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DOCTOR",
        isEmailVerified: true, // Admin-created → auto verified
      },
    });

    const doctor = await tx.doctor.create({
      data: {
        userId: user.id,
        specialization,
        experience,
        consultationFee,
        clinicName,
        clinicAddress,
      },
    });

    return { user, doctor };
  });

  return result;
};

export const getAllDoctors = async () => {
    return await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  };

  export const getDoctorById = async (doctorId: string) => {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  
    if (!doctor) {
      throw new Error("Doctor not found");
    }
  
    return doctor;
  };


  export const updateMyDoctorProfile = async (
    userId: string,
    data: {
      specialization?: string;
      experience?: number;
      consultationFee?: number;
      clinicName?: string;
      clinicAddress?: string;
    }
  ) => {
    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });
  
    if (!doctor) {
      throw new Error("Doctor profile not found");
    }
  
    const updatedDoctor = await prisma.doctor.update({
      where: { userId },
      data,
    });
  
    return updatedDoctor;
  };

  export const createDoctorProfile = async (
    userId: string,
    data: {
      specialization: string;
      experience: number;
      consultationFee: number;
      clinicName?: string;
      clinicAddress?: string;
    }
  ) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
  
    if (!user || user.role !== "DOCTOR") {
      throw new Error("Only doctors can create profile");
    }
  
    const existing = await prisma.doctor.findUnique({
      where: { userId },
    });
  
    if (existing) {
      throw new Error("Doctor profile already exists");
    }
  
    const doctor = await prisma.doctor.create({
      data: {
        userId,
        ...data,
      },
    });
  
    return doctor;
  };