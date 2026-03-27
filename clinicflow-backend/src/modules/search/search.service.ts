import prisma from "../../config/db";

export class SearchService {

  static async searchDoctors(req: any, specialization?: string) {
    const clinicId = req.clinicId;

    return prisma.doctor.findMany({
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