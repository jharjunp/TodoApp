-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_relayId_fkey";

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_relayId_fkey" FOREIGN KEY ("relayId") REFERENCES "Relay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
