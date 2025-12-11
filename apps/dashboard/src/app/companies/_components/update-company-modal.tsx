"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm } from "./company-form";
import type { CompanyType } from "@repo/db";

interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: CompanyType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface UpdateCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
}

export function UpdateCompanyModal({
  open,
  onOpenChange,
  company,
}: UpdateCompanyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        <CompanyForm
          defaultValues={{
            name: company.name,
            email: company.email || "",
            phone: company.phone || "",
            type: company.type,
          }}
          companyId={company.id}
          onSubmit={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
