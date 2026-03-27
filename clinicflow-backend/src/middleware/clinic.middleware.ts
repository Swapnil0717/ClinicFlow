import { Request, Response, NextFunction } from "express";

export const clinicMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as {
    userId: string;
    role: string;
    clinicId?: string;
  };

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!user.clinicId) {
    return res.status(403).json({
      message: "No clinic associated. Please create or join a clinic.",
    });
  }

  // 🔥 Attach to request
  (req as any).clinicId = user.clinicId;

  next();
};