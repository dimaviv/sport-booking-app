/*
  Warnings:

  - You are about to drop the column `district` on the `Facility` table. All the data in the column will be lost.
  - You are about to alter the column `location` on the `Facility` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Unsupported("POINT")`.
  - Added the required column `districtId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Changed the column `sportType` on the `Facility` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- DropIndex
-- DROP INDEX "Facility_search_vector_idx";

-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "district",
ADD COLUMN     "districtId" INTEGER NOT NULL,
ADD COLUMN     "isWorking" BOOLEAN NOT NULL DEFAULT false,
-- ALTER COLUMN "location" SET DATA TYPE POINT USING "location"::point,
DROP COLUMN "sportType",
ADD COLUMN "sportType" "sport_type"[] NOT NULL;
-- ALTER COLUMN "search_vector" DROP DEFAULT;

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_city_name" ON "City"("name");

-- CreateIndex
CREATE INDEX "idx_district_name" ON "District"("name");

-- CreateIndex
CREATE INDEX "idx_district_cityId" ON "District"("cityId");

-- CreateIndex
-- CREATE INDEX "Facility_search_vector_idx" ON "Facility"("search_vector");

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
