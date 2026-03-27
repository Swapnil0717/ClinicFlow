import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";
import prisma from "../config/db";

export const authMiddleware = (roles?: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as { userId: string; role: string };

      // 🔥 Fetch clinicId
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { clinicId: true },
      });

      let userData: any = {
        userId: decoded.userId,
        role: decoded.role,
        clinicId: dbUser?.clinicId,
      };

      // 🔥 Add doctorId if needed
      if (decoded.role === "DOCTOR") {
        const doctor = await prisma.doctor.findUnique({
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
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};