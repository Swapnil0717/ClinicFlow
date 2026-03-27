import prisma from "../../config/db";

export class PatientService {

  static async getDashboard(req: any) {
    const clinicId = req.clinicId;
    const patientId = req.user.userId;

    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        patientId,
      },
      include: {
        doctor: {
          include: { user: true },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return appointments;
  }
}