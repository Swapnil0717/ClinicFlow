import prisma from "../config/db";

export const requireActiveSubscription = async (req, res, next) => {
    const clinicId = req.user.clinicId;
  
    const sub = await prisma.subscription.findFirst({
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