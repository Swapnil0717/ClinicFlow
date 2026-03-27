import prisma from "./src/config/db";

async function main() {
  const clinic = await prisma.clinic.create({
    data: {
      name: "Default Clinic",
      address: "Main",
    },
  });

  await prisma.user.updateMany({
    data: { clinicId: clinic.id },
  });

  await prisma.doctor.updateMany({
    data: { clinicId: clinic.id },
  });

  console.log("Done");
}

main();