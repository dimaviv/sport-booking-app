/*
  Warnings:

  - The `minBookingTime` column on the `Facility` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "minBookingTime",
ADD COLUMN     "minBookingTime" INTEGER;

