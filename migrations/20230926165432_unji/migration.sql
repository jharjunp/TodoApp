/*
  Warnings:

  - A unique constraint covering the columns `[deviceID]` on the table `Relay` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Relay" ALTER COLUMN "deviceID" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Relay_deviceID_key" ON "Relay"("deviceID");
