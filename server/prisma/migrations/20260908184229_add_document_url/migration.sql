/*
  Warnings:

  - You are about to drop the column `status` on the `Document` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentSourceType" AS ENUM ('FILE', 'WEBSITE', 'YOUTUBE');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "status",
ADD COLUMN     "sourceType" "DocumentSourceType" NOT NULL DEFAULT 'FILE',
ADD COLUMN     "sourceUrl" TEXT,
ALTER COLUMN "storagePath" DROP NOT NULL;

-- DropEnum
DROP TYPE "DocumentStatus";
