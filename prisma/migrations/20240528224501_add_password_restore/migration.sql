
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "restorePasswordToken" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);
