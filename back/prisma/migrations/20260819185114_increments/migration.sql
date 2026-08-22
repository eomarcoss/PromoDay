/*
  Warnings:

  - You are about to alter the column `originalPrice` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `promoPrice` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "totalRedemptions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSavedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "promotions" ALTER COLUMN "originalPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "promoPrice" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "totalPromotions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSales" INTEGER NOT NULL DEFAULT 0;
