-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "salesPersonId" TEXT;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_salesPersonId_fkey" FOREIGN KEY ("salesPersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
