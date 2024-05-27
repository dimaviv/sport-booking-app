
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "includesInventory" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "inventoryName" TEXT,
ADD COLUMN     "inventoryPrice" DECIMAL(8,2),
ADD COLUMN     "isRemoved" BOOLEAN NOT NULL DEFAULT false;
