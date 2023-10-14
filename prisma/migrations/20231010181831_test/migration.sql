/*
  Warnings:

  - The `sportType` column on the `Facility` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "address" TEXT,
ADD COLUMN     "district" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL,
ALTER COLUMN "coveringType" DROP NOT NULL,
ALTER COLUMN "facilityType" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "minBookingTime" DROP NOT NULL,
DROP COLUMN "sportType",
ADD COLUMN     "sportType" "covering_type";
