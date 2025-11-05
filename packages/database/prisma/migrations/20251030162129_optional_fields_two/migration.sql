-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_companyId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
