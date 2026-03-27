import prisma from "../../config/db";

export class ClinicService {

  static async createClinic(req: any, data: any) {
    const userId = req.user.userId;

    return prisma.$transaction(async (tx) => {

      const existing = await tx.user.findUnique({
        where: { id: userId },
      });

      if (existing?.clinicId) {
        throw new Error("Already in clinic");
      }

      const clinic = await tx.clinic.create({
        data,
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
  }

  static async getClinics(req: any) {
    return prisma.clinic.findMany();
  }
}