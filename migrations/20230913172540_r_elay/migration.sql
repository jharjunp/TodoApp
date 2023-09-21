-- CreateTable
CREATE TABLE "Relay" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "isOn" BOOLEAN NOT NULL,
    "SetOn" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Relay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Relay" ADD CONSTRAINT "Relay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
