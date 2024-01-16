/*
  Warnings:

  - You are about to drop the `BlockedSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Slot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `facilityId` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BlockedSlot" DROP CONSTRAINT "BlockedSlot_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "BookingSlot" DROP CONSTRAINT "BookingSlot_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingSlot" DROP CONSTRAINT "BookingSlot_slotId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_scheduledId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "facilityId" SET NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- DropTable
DROP TABLE "BlockedSlot";

-- DropTable
DROP TABLE "BookingSlot";

-- DropTable
DROP TABLE "Slot";

-- CreateTable
CREATE TABLE "Blocking" (
    "id" SERIAL NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL,

    CONSTRAINT "Blocking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocking" ADD CONSTRAINT "Blocking_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
