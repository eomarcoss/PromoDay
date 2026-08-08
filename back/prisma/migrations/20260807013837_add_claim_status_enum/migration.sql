/*
  Warnings:

  - The `status` column on the `Claim` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[customerId,promotionId]` on the table `Claim` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'USED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "status",
ADD COLUMN     "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Claim_customerId_promotionId_key" ON "Claim"("customerId", "promotionId");
