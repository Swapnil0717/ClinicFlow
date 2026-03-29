"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicService = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ClinicService {
    constructor() {
        this.createClinicForUser = async (userId, data) => {
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
                        owner: {
                            connect: { id: userId }, // ✅ FIX
                        },
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
    }
    static async getClinics(req) {
        return db_1.default.clinic.findMany();
    }
}
exports.ClinicService = ClinicService;
