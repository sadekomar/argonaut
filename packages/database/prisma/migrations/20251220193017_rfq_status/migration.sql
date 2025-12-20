-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('SENT', 'RECEIVED');

-- AlterTable
ALTER TABLE "Rfq" ADD COLUMN     "rfqStatus" "RfqStatus" NOT NULL DEFAULT 'SENT';
