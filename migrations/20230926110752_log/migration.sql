-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "outcome" BOOLEAN NOT NULL,
    "logEntry" JSONB NOT NULL,
    "relayId" INTEGER,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_relayId_fkey" FOREIGN KEY ("relayId") REFERENCES "Relay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
