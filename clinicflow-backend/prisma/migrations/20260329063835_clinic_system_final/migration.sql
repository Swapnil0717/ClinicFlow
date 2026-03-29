/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Appointment` table. All the data in the column will be lost.
  - The `status` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `clinicAddress` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `clinicName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `consultationFee` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `isOverride` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `maxPatientsPerSubSlot` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `slotDuration` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SubSlot` table. All the data in the column will be lost.
  - You are about to drop the column `currentBookings` on the `SubSlot` table. All the data in the column will be lost.
  - You are about to drop the column `isFull` on the `SubSlot` table. All the data in the column will be lost.
  - You are about to drop the column `maxBookings` on the `SubSlot` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifyToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RecurringSlot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clinicId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Made the column `clinicId` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clinicId` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `SubSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringSlot" DROP CONSTRAINT "RecurringSlot_doctorId_fkey";

-- DropIndex
DROP INDEX "Appointment_doctorId_startTime_idx";

-- DropIndex
DROP INDEX "Appointment_patientId_idx";

-- DropIndex
DROP INDEX "Appointment_patientId_subSlotId_key";

-- DropIndex
DROP INDEX "Appointment_subSlotId_idx";

-- DropIndex
DROP INDEX "Slot_doctorId_date_idx";

-- DropIndex
DROP INDEX "Slot_doctorId_date_startTime_key";

-- DropIndex
DROP INDEX "SubSlot_slotId_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "updatedAt",
ADD COLUMN     "clinicId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'BOOKED';

-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "clinicAddress",
DROP COLUMN "clinicName",
DROP COLUMN "consultationFee",
DROP COLUMN "experience",
DROP COLUMN "specialization",
DROP COLUMN "updatedAt",
ALTER COLUMN "clinicId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "isActive",
DROP COLUMN "isOverride",
DROP COLUMN "maxPatientsPerSubSlot",
DROP COLUMN "mode",
DROP COLUMN "slotDuration",
DROP COLUMN "type",
ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubSlot" DROP COLUMN "createdAt",
DROP COLUMN "currentBookings",
DROP COLUMN "isFull",
DROP COLUMN "maxBookings",
ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifyToken",
DROP COLUMN "isEmailVerified",
DROP COLUMN "provider",
DROP COLUMN "providerId",
DROP COLUMN "resetPasswordExpiry",
DROP COLUMN "resetPasswordToken",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "RecurringSlot";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- DropEnum
DROP TYPE "AuthProvider";

-- DropEnum
DROP TYPE "SlotMode";

-- DropEnum
DROP TYPE "SlotType";

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clinicId" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubSlot" ADD CONSTRAINT "SubSlot_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
