-- CreateIndex
CREATE INDEX "Company_responsibleSalesPersonId_idx" ON "Company"("responsibleSalesPersonId");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_type_idx" ON "Company"("type");

-- CreateIndex
CREATE INDEX "FollowUp_authorId_idx" ON "FollowUp"("authorId");

-- CreateIndex
CREATE INDEX "Person_companyId_idx" ON "Person"("companyId");

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_email_idx" ON "Person"("email");

-- CreateIndex
CREATE INDEX "Project_companyId_idx" ON "Project"("companyId");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE INDEX "Quote_authorId_idx" ON "Quote"("authorId");

-- CreateIndex
CREATE INDEX "Quote_supplierId_idx" ON "Quote"("supplierId");

-- CreateIndex
CREATE INDEX "Quote_clientId_idx" ON "Quote"("clientId");

-- CreateIndex
CREATE INDEX "Quote_projectId_idx" ON "Quote"("projectId");

-- CreateIndex
CREATE INDEX "Quote_contactPersonId_idx" ON "Quote"("contactPersonId");

-- CreateIndex
CREATE INDEX "Quote_quoteOutcome_idx" ON "Quote"("quoteOutcome");

-- CreateIndex
CREATE INDEX "Quote_referenceNumber_idx" ON "Quote"("referenceNumber");

-- CreateIndex
CREATE INDEX "Quote_date_idx" ON "Quote"("date");

-- CreateIndex
CREATE INDEX "Registration_companyId_idx" ON "Registration"("companyId");

-- CreateIndex
CREATE INDEX "Registration_authorId_idx" ON "Registration"("authorId");

-- CreateIndex
CREATE INDEX "Registration_registrationStatus_idx" ON "Registration"("registrationStatus");

-- CreateIndex
CREATE INDEX "Rfq_authorId_idx" ON "Rfq"("authorId");

-- CreateIndex
CREATE INDEX "Rfq_supplierId_idx" ON "Rfq"("supplierId");

-- CreateIndex
CREATE INDEX "Rfq_clientId_idx" ON "Rfq"("clientId");

-- CreateIndex
CREATE INDEX "Rfq_projectId_idx" ON "Rfq"("projectId");

-- CreateIndex
CREATE INDEX "Rfq_referenceNumber_idx" ON "Rfq"("referenceNumber");
