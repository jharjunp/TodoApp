/*
  Warnings:

  - A unique constraint covering the columns `[timeStamp]` on the table `PriceData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PriceData_timeStamp_key" ON "PriceData"("timeStamp");
