/*
  Warnings:

  - You are about to drop the column `rfqId` on the `Quote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quoteId]` on the table `Rfq` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PURSUING', 'REQUIREMENTS_COLLECTED', 'DOCS_SENT', 'UNDER_REVIEW', 'PENDING_CONFIRMATION', 'VERIFIED', 'ON_HOLD', 'DECLINED');

-- DropForeignKey
ALTER TABLE "public"."Quote" DROP CONSTRAINT "Quote_rfqId_fkey";

-- DropIndex
DROP INDEX "public"."Quote_rfqId_key";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "rfqId";

-- AlterTable
ALTER TABLE "Rfq" ADD COLUMN     "quoteId" TEXT;

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "registrationStatus" "RegistrationStatus" NOT NULL,
    "authorId" TEXT NOT NULL,
    "registrationFile" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FollowUp_quoteId_idx" ON "FollowUp"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Rfq_quoteId_key" ON "Rfq"("quoteId");

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rfq" ADD CONSTRAINT "Rfq_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
