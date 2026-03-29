import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { AuthRequest } from "../types/express";

export const authMiddleware = (roles?: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // 🔐 Check token existence
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Unauthorized - No token",
        });
      }

      const token = authHeader.split(" ")[1];

      // 🔐 Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as { userId: string; role: string };

      // 🔥 Fetch user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          role: true,
          clinicId: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      // 🔥 Base user data
      let userData: any = {
        userId: user.id,
        role: user.role,
        clinicId: user.clinicId,
      };

      //////////////////////////////////////
      // 🏥 CHECK FOR REJECTED CLINIC
      //////////////////////////////////////
      if (user.clinicId) {
        const clinic = await prisma.clinic.findUnique({
          where: { id: user.clinicId },
          select: { rejected: true },
        });

        if (clinic?.rejected) {
          return res.status(403).json({
            message: "Clinic is rejected. Contact support.",
          });
        }
      }

      //////////////////////////////////////
      // 🩺 DOCTOR SECURITY BLOCK
      //////////////////////////////////////
      if (user.role === "DOCTOR") {
        const doctor = await prisma.doctor.findUnique({
          where: { userId: user.id },
          select: {
            id: true,
            isVerified: true,
            rejected: true,
            clinic: {
              select: {
                isVerified: true,
              },
            },
          },
        });

        // ❌ No doctor profile
        if (!doctor) {
          return res.status(403).json({
            message: "Doctor profile not found",
          });
        }

        // ❌ Rejected doctor
        if (doctor.rejected) {
          return res.status(403).json({
            message: "Doctor account rejected",
          });
        }

        // ❌ Not verified doctor or clinic
        if (!doctor.isVerified || !doctor.clinic.isVerified) {
          return res.status(403).json({
            message: "Doctor or clinic not verified",
          });
        }

        // ✅ Attach doctorId
        userData.doctorId = doctor.id;
      }

      //////////////////////////////////////
      // 🔐 ROLE-BASED ACCESS
      //////////////////////////////////////
      if (roles && !roles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      //////////////////////////////////////
      // ✅ Attach user to request
      //////////////////////////////////////
      req.user = userData;

      next();

    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};