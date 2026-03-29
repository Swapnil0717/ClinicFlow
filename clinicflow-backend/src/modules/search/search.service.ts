import prisma from "../../config/db";

export class SearchService {

  static async searchDoctors({
    clinicId,
    specialization,
  }: {
    clinicId: string;
    specialization?: string;
  }) {

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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}