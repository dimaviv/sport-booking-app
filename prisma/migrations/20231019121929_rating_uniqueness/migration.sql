/*
  Warnings:

  - A unique constraint covering the columns `[userId,facilityId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_facilityId_key" ON "Rating"("userId", "facilityId");
