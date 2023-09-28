/*
  Warnings:

  - Added the required column `userId` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Made the column `relayId` on table `Log` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_relayId_fkey";

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "relayId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_relayId_fkey" FOREIGN KEY ("relayId") REFERENCES "Relay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
