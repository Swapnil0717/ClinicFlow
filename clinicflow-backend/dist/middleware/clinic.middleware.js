"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicMiddleware = void 0;
const clinicMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!user.clinicId) {
        return res.status(403).json({
            message: "No clinic associated. Please create or join a clinic.",
        });
    }
    // 🔥 Attach to request
    req.clinicId = user.clinicId;
    next();
};
exports.clinicMiddleware = clinicMiddleware;
