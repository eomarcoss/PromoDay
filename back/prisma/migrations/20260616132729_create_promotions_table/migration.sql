/*
  Warnings:

  - You are about to drop the column `title` on the `Promotion` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limitPerUser` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promoPrice` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "limitPerUser" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "originalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "promoPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
