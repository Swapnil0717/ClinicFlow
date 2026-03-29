import prisma from "../../config/db";
import { hashPassword } from "../../utils/hashPassword";
import { AuthRequest } from "../../types/express";
import { generateTokens } from "../../utils/generateTokens";
import { sendEmail } from "../../utils/emailService";
import bcrypt from "bcrypt";

//////////////////////////////
// CREATE DOCTOR (ADMIN)
//////////////////////////////

export const createDoctor = async (
  req: AuthRequest,
  data: {
    name: string;
    email: string;
    password: string;
    specialization?: string;
    experience?: number;
    consultationFee?: number;
  }
) => {

  if (req.user?.role !== "ADMIN") {
    throw new Error("Only admin can create doctor");
  }

  const clinicId = req.user?.clinicId;
  if (!clinicId) throw new Error("Clinic not found");

  return prisma.$transaction(async (tx) => {

    const existing = await tx.user.findUnique({
      where: { email: data.email },
    });

    if (existing) throw new Error("User already exists");

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
        isVerified: false,
      },
    });

    return { user, doctor };
  });
};

//////////////////////////////
// VERIFY DOCTOR + AUTO LOGIN
//////////////////////////////

export const verifyDoctor = async (doctorId: string) => {

  const doctor = await prisma.doctor.update({
    where: { id: doctorId },
    data: { isVerified: true },
    include: {
      user: true,
      clinic: true,
    },
  });

  // 🔐 Generate tokens
  const tokens = generateTokens({
    userId: doctor.user.id,
    role: doctor.user.role,
    clinicId: doctor.user.clinicId,
  });

  // 🔐 Store hashed refresh token (IMPORTANT FIX)
  await prisma.user.update({
    where: { id: doctor.user.id },
    data: {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    },
  });

  // 📧 Send email with auto-login
  const loginLink = `${process.env.FRONTEND_URL}/auto-login?token=${tokens.accessToken}`;

  await sendEmail(
    doctor.user.email,
    "🎉 Doctor Approved",
    `
    <h2>Congratulations Dr. ${doctor.user.name}</h2>
    <p>Your account and clinic have been approved.</p>
    <p>Click below to login instantly:</p>
    <a href="${loginLink}" style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">
      Login Now
    </a>
    `
  );

  return {
    doctor,
    tokens,
  };
};

//////////////////////////////
// PENDING DOCTORS
//////////////////////////////

export const getPendingDoctors = async () => {
  return prisma.doctor.findMany({
    where: { isVerified: false },
    include: {
      user: true,
      clinic: true,
    },
  });
};

//////////////////////////////
// GET ALL DOCTORS
//////////////////////////////

export const getAllDoctors = async (req: AuthRequest) => {

  if (!req.user?.clinicId) {
    throw new Error("Clinic not found");
  }

  return prisma.doctor.findMany({
    where: { clinicId: req.user.clinicId },
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

//////////////////////////////
// GET DOCTOR BY ID
//////////////////////////////

export const getDoctorById = async (
  req: AuthRequest,
  doctorId: string
) => {

  if (!req.user?.clinicId) {
    throw new Error("Clinic not found");
  }

  const doctor = await prisma.doctor.findFirst({
    where: {
      id: doctorId,
      clinicId: req.user.clinicId,
    },
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

  if (!doctor) throw new Error("Doctor not found");

  return doctor;
};

//////////////////////////////
// REJECT DOCTOR
//////////////////////////////

export const rejectDoctor = async (
  doctorId: string,
  reason: string
) => {

  if (!reason) {
    throw new Error("Rejection reason is required");
  }

  const doctor = await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      rejected: true,
      rejectionReason: reason,
      isVerified: false,
    },
    include: {
      user: true,
      clinic: true,
    },
  });

  // 📧 Send rejection email
  await sendEmail(
    doctor.user.email,
    "❌ Doctor Application Rejected",
    `
    <h2>Hello Dr. ${doctor.user.name}</h2>
    <p>We regret to inform you that your application has been rejected.</p>
    <p><b>Reason:</b> ${reason}</p>
    <p>You may contact support or re-apply.</p>
    `
  );

  return doctor;
};