-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "responsibleSalesPersonId" TEXT;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_responsibleSalesPersonId_fkey" FOREIGN KEY ("responsibleSalesPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
