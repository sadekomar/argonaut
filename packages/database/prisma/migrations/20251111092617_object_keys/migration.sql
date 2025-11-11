-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "objectKeys" TEXT[];

-- AlterTable
ALTER TABLE "Rfq" ADD COLUMN     "rfqReceivedAt" TIMESTAMP(3);
