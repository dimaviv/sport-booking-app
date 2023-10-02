/*
  Warnings:

  - The primary key for the `UsersRoles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UsersRoles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UsersRoles_userId_roleId_key";

-- AlterTable
ALTER TABLE "UsersRoles" DROP CONSTRAINT "UsersRoles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UsersRoles_pkey" PRIMARY KEY ("userId", "roleId");
