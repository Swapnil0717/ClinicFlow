import prisma from "../../config/db";
import { hashPassword } from "../../utils/hashPassword";
import { comparePassword } from "../../utils/comparePassword";
import { generateTokens } from "../../utils/generateTokens";
import { sendEmail } from "../../utils/emailService";
import { verifyGoogleToken } from "../../utils/googleAuth";
import crypto from "crypto";

// ✅ REGISTER
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}) => {
  const { name, email, password, role } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const emailToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      emailVerifyToken: emailToken,
    },
  });

  // ✅ FIXED: Use backend URL (no frontend needed)
  const verifyLink = `http://localhost:5000/api/auth/verify-email?token=${emailToken}`;

  await sendEmail(
    email,
    "Verify your email",
    `<p>Click below to verify your email:</p>
     <a href="${verifyLink}">${verifyLink}</a>`
  );

  return { message: "User registered. Please verify email." };
};

// ✅ LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  if (!user.password) throw new Error("Use Google login");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email");
  }

  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
  });

  return tokens;
};

// ✅ FIXED: VERIFY EMAIL FUNCTION RESTORED
export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token },
  });

  if (!user) throw new Error("Invalid token");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
    },
  });

  return { message: "Email verified successfully" };
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");

  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: expiry,
    },
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    "Reset your password",
    `<p>Click below to reset password:</p>
     <a href="${resetLink}">${resetLink}</a>`
  );

  return { message: "Reset password link sent" };
};

// ✅ RESET PASSWORD
export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}) => {
  const { token, newPassword } = data;

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return { message: "Password reset successful" };
};

// ✅ GOOGLE LOGIN
export const googleLogin = async (idToken: string) => {
  const payload = await verifyGoogleToken(idToken);

  if (!payload?.email) {
    throw new Error("Invalid Google token");
  }

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
  }

  const tokens = generateTokens({
    userId: user.id,
    role: user.role,
  });

  return tokens;
};