/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_userId_key" ON "ApiKey"("userId");
