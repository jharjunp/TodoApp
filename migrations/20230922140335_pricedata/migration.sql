-- CreateTable
CREATE TABLE "PriceData" (
    "id" SERIAL NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PriceData_pkey" PRIMARY KEY ("id")
);
