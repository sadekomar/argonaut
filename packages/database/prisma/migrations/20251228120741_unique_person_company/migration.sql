/*
  Warnings:

  - A unique constraint covering the columns `[name,companyId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Person_name_companyId_key" ON "Person"("name", "companyId");
