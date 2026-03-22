import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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

    // ===============================
    // BUILD USER OBJECT
    // ===============================
    let userData: any = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // ===============================
    // ADD DOCTOR ID IF NEEDED
    // ===============================
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

    req.user = userData;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};