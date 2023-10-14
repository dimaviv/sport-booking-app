/*
  Warnings:

  - The `sportType` column on the `Facility` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "sportType",
ADD COLUMN     "sportType" "sport_type";
