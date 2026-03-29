"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorById = exports.getAllDoctors = exports.createDoctor = void 0;
const db_1 = __importDefault(require("../../config/db"));
const hashPassword_1 = require("../../utils/hashPassword");
const createDoctor = async (req, data) => {
    const clinicId = req.clinicId;
    return db_1.default.$transaction(async (tx) => {
        const existing = await tx.user.findUnique({
            where: { email: data.email },
        });
        if (existing)
            throw new Error("User exists");
        const hashedPassword = await (0, hashPassword_1.hashPassword)(data.password);
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
exports.createDoctor = createDoctor;
const getAllDoctors = async (req) => {
    return db_1.default.doctor.findMany({
        where: { clinicId: req.clinicId },
        include: { user: true },
    });
};
exports.getAllDoctors = getAllDoctors;
const getDoctorById = async (req, doctorId) => {
    const doctor = await db_1.default.doctor.findFirst({
        where: {
            id: doctorId,
            clinicId: req.clinicId,
        },
        include: { user: true },
    });
    if (!doctor)
        throw new Error("Not found");
    return doctor;
};
exports.getDoctorById = getDoctorById;
