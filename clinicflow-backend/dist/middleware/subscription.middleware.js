"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSubscription = void 0;
const db_1 = __importDefault(require("../config/db"));
const requireActiveSubscription = async (req, res, next) => {
    const clinicId = req.user.clinicId;
    const sub = await db_1.default.subscription.findFirst({
        where: {
            clinicId,
            status: "ACTIVE",
            endDate: { gte: new Date() },
        },
    });
    if (!sub) {
        return res.status(403).json({
            message: "No active subscription",
        });
    }
    next();
};
exports.requireActiveSubscription = requireActiveSubscription;
