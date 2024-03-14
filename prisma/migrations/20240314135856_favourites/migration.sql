/*
  Warnings:

  - Made the column `ownerId` on table `Facility` required. This step will fail if there are existing NULL values in that column.

*/


-- AlterTable
ALTER TABLE "Facility" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFacilities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_facilityId_key" ON "Favorite"("userId", "facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFacilities_AB_unique" ON "_UserFacilities"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFacilities_B_index" ON "_UserFacilities"("B");


-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFacilities" ADD CONSTRAINT "_UserFacilities_A_fkey" FOREIGN KEY ("A") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFacilities" ADD CONSTRAINT "_UserFacilities_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
