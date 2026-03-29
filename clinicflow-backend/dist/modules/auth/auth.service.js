"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClinicForUser = exports.googleLogin = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../../config/db"));
const hashPassword_1 = require("../../utils/hashPassword");
const comparePassword_1 = require("../../utils/comparePassword");
const generateTokens_1 = require("../../utils/generateTokens");
const emailService_1 = require("../../utils/emailService");
const googleAuth_1 = require("../../utils/googleAuth");
const crypto_1 = __importDefault(require("crypto"));
//////////////////////////////
// ✅ REGISTER (SaaS SAFE)
//////////////////////////////
const registerUser = async (data) => {
    const { name, email, password } = data;
    const existingUser = await db_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, hashPassword_1.hashPassword)(password);
    const emailToken = crypto_1.default.randomBytes(32).toString("hex");
    const user = await db_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "PATIENT", // 🔥 FORCE PATIENT
            emailVerifyToken: emailToken,
        },
    });
    const verifyLink = `http://localhost:5000/api/auth/verify-email?token=${emailToken}`;
    await (0, emailService_1.sendEmail)(email, "Verify your email", `<p>Click below to verify your email:</p>
     <a href="${verifyLink}">${verifyLink}</a>`);
    return {
        message: "User registered. Please verify email.",
        userId: user.id,
    };
};
exports.registerUser = registerUser;
//////////////////////////////
// ✅ LOGIN
//////////////////////////////
const loginUser = async (data) => {
    const { email, password } = data;
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Invalid credentials");
    if (!user.password)
        throw new Error("Use Google login");
    const isMatch = await (0, comparePassword_1.comparePassword)(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    if (!user.isEmailVerified) {
        throw new Error("Please verify your email");
    }
    // 🔥 SaaS Rule
    if (user.role !== "PATIENT" && !user.clinicId) {
        throw new Error("Please create or join a clinic to continue");
    }
    const tokens = (0, generateTokens_1.generateTokens)({
        userId: user.id,
        role: user.role,
        clinicId: user.clinicId,
    });
    return tokens;
};
exports.loginUser = loginUser;
//////////////////////////////
// ✅ VERIFY EMAIL (AUTO LOGIN)
//////////////////////////////
const verifyEmail = async (token) => {
    const user = await db_1.default.user.findFirst({
        where: { emailVerifyToken: token },
    });
    if (!user)
        throw new Error("Invalid token");
    await db_1.default.user.update({
        where: { id: user.id },
        data: {
            isEmailVerified: true,
            emailVerifyToken: null,
        },
    });
    const tokens = (0, generateTokens_1.generateTokens)({
        userId: user.id,
        role: user.role,
        clinicId: user.clinicId,
    });
    return {
        message: "Email verified successfully",
        tokens,
    };
};
exports.verifyEmail = verifyEmail;
//////////////////////////////
// ✅ FORGOT PASSWORD
//////////////////////////////
const forgotPassword = async (email) => {
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    await db_1.default.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordExpiry: expiry,
        },
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await (0, emailService_1.sendEmail)(email, "Reset your password", `<p>Click below to reset password:</p>
     <a href="${resetLink}">${resetLink}</a>`);
    return { message: "Reset password link sent" };
};
exports.forgotPassword = forgotPassword;
//////////////////////////////
// ✅ RESET PASSWORD
//////////////////////////////
const resetPassword = async (data) => {
    const { token, newPassword } = data;
    const user = await db_1.default.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpiry: {
                gte: new Date(),
            },
        },
    });
    if (!user)
        throw new Error("Invalid or expired token");
    const hashedPassword = await (0, hashPassword_1.hashPassword)(newPassword);
    await db_1.default.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiry: null,
        },
    });
    return { message: "Password reset successful" };
};
exports.resetPassword = resetPassword;
//////////////////////////////
// ✅ GOOGLE LOGIN
//////////////////////////////
const googleLogin = async (idToken) => {
    const payload = await (0, googleAuth_1.verifyGoogleToken)(idToken);
    if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
        throw new Error("Invalid Google token");
    }
    let user = await db_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        user = await db_1.default.user.create({
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
    // 🔥 SaaS Rule
    if (user.role !== "PATIENT" && !user.clinicId) {
        throw new Error("Please create or join a clinic");
    }
    const tokens = (0, generateTokens_1.generateTokens)({
        userId: user.id,
        role: user.role,
        clinicId: user.clinicId,
    });
    return tokens;
};
exports.googleLogin = googleLogin;
//////////////////////////////
// ✅ CREATE CLINIC (SaaS CORE)
//////////////////////////////
const createClinicForUser = async (userId, data) => {
    return db_1.default.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        if (existingUser.clinicId) {
            throw new Error("User already belongs to a clinic");
        }
        const clinic = await tx.clinic.create({
            data: {
                name: data.name,
                address: data.address,
                ownerId: userId,
            },
        });
        await tx.user.update({
            where: { id: userId },
            data: {
                clinicId: clinic.id,
                role: "ADMIN",
            },
        });
        return clinic;
    });
};
exports.createClinicForUser = createClinicForUser;
