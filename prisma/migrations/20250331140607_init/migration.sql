-- CreateTable
CREATE TABLE "Paperwork" (
    "id" SERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "estimatedCompletion" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "nextStep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paperwork_pkey" PRIMARY KEY ("id")
);
