/*
  Warnings:

  - Changed the type of `hinnat` on the `Hinnat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Hinnat" DROP COLUMN "hinnat",
ADD COLUMN     "hinnat" JSONB NOT NULL;
