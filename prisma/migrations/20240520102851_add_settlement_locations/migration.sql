

-- AlterTable
ALTER TABLE "City" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "District" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

