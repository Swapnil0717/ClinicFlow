"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const authMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            // 🔥 Fetch clinicId
            const dbUser = await db_1.default.user.findUnique({
                where: { id: decoded.userId },
                select: { clinicId: true },
            });
            let userData = {
                userId: decoded.userId,
                role: decoded.role,
                clinicId: dbUser === null || dbUser === void 0 ? void 0 : dbUser.clinicId,
            };
            // 🔥 Add doctorId if needed
            if (decoded.role === "DOCTOR") {
                const doctor = await db_1.default.doctor.findUnique({
                    where: { userId: decoded.userId },
                    select: { id: true },
                });
                if (!doctor) {
                    return res.status(403).json({
                        message: "Doctor profile not found",
                    });
                }
                userData.doctorId = doctor.id;
            }
            // 🔥 Role check
            if (roles && !roles.includes(userData.role)) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }
            req.user = userData;
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        }
    };
};
exports.authMiddleware = authMiddleware;
