/*
  Warnings:

  - Changed the type of `provider` on the `ApiKey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ApiProviders" AS ENUM ('openai', 'geminiai', 'groq');

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "provider",
ADD COLUMN     "provider" "ApiProviders" NOT NULL;
