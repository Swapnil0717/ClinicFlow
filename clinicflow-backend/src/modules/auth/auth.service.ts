import prisma from "../../config/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { generateTokens } from "../../utils/generateTokens";
import { sendEmail } from "../../utils/emailService";
import { verifyGoogleToken } from "../../utils/googleAuth";
import {
  verifyEmailTemplate,
  resetPasswordTemplate,
} from "../../utils/emailTemplates";

//////////////////////////////
// REGISTER
//////////////////////////////

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "PATIENT" | "DOCTOR";
  clinicName?: string;
  clinicAddress?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  const role = data.role ?? "PATIENT";

  // 🔁 Resend verification if not verified
  if (existingUser) {
    if (!existingUser.isEmailVerified) {
      const token = crypto.randomBytes(32).toString("hex");

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerifyToken: token,
          emailVerifyExpiry: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      const link = `${process.env.API_URL}/api/v1/auth/verify-email?token=${token}`;
      await sendEmail(
        existingUser.email,
        "Verify Email",
        verifyEmailTemplate(existingUser.name, link)
      );

      return { message: "Verification email resent" };
    }

    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const emailToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
      emailVerifyToken: emailToken,
      emailVerifyExpiry: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // 👤 Patient
  if (role === "PATIENT") {
    await prisma.patient.create({
      data: { userId: user.id },
    });
  }

  // 🩺 Doctor + Clinic creation (UNVERIFIED)
  if (role === "DOCTOR") {
    if (!data.clinicName || !data.clinicAddress) {
      throw new Error("Clinic name and address required");
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: data.clinicName,
        address: data.clinicAddress,
        ownerId: user.id,
      },
    });

    await prisma.doctor.create({
      data: {
        userId: user.id,
        clinicId: clinic.id,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { clinicId: clinic.id },
    });
  }

  const verifyLink = `${process.env.API_URL}/api/v1/auth/verify-email?token=${emailToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    verifyEmailTemplate(user.name, verifyLink)
  );

  return { message: "Registered successfully. Verify email." };
};

//////////////////////////////
// VERIFY EMAIL
//////////////////////////////

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpiry: { gte: new Date() },
    },
  });

  if (!user) throw new Error("Invalid or expired token");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return { message: "Email verified successfully" };
};

//////////////////////////////
// LOGIN
//////////////////////////////

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Invalid credentials");

  if (!user.password) {
    throw new Error("Use Google login");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Verify email first");
  }

  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
    clinicId: user.clinicId,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    },
  });

  return tokens;
};

//////////////////////////////
// REFRESH TOKEN
//////////////////////////////

export const refreshAccessToken = async (refreshToken: string) => {
  let payload: any;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  } catch {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.refreshToken) {
    throw new Error("Unauthorized");
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) throw new Error("Token mismatch");

  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
    clinicId: user.clinicId,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    },
  });

  return tokens;
};

//////////////////////////////
// FORGOT PASSWORD
//////////////////////////////

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const link = `${process.env.API_URL}/api/v1/auth/reset-password?token=${token}`;

  await sendEmail(
    user.email,
    "Reset Password",
    resetPasswordTemplate(user.name, link)
  );

  return { message: "Reset email sent" };
};

//////////////////////////////
// RESET PASSWORD
//////////////////////////////

export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: data.token,
      resetPasswordExpiry: { gte: new Date() },
    },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashed = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return { message: "Password reset successful" };
};

//////////////////////////////
// GOOGLE LOGIN
//////////////////////////////

export const googleLogin = async (idToken: string) => {
  const payload = await verifyGoogleToken(idToken);

  if (!payload?.email) throw new Error("Invalid Google token");

  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name || "Google User",
        email: payload.email,
        role: "PATIENT",
        isEmailVerified: true,
        provider: "GOOGLE",
        providerId: payload.sub,
      },
    });

    await prisma.patient.create({
      data: { userId: user.id },
    });
  }

  return generateTokens({
    userId: user.id,
    role: user.role,
    clinicId: user.clinicId,
  });
};

//////////////////////////////
// LOGOUT
//////////////////////////////

export const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: "Logged out successfully" };
};