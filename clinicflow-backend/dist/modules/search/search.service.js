"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const db_1 = __importDefault(require("../../config/db"));
class SearchService {
    static async searchDoctors(req, specialization) {
        const clinicId = req.clinicId;
        return db_1.default.doctor.findMany({
            where: {
                clinicId,
                ...(specialization && {
                    specialization: {
                        contains: specialization,
                        mode: "insensitive",
                    },
                }),
            },
            include: {
                user: { select: { name: true } },
            },
        });
    }
}
exports.SearchService = SearchService;
