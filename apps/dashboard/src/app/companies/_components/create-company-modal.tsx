"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompanyForm } from "./company-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddCompanyModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Create a new company in the system.
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          defaultValues={{
            name: "",
            email: "",
            phone: "",
            type: "CLIENT",
          }}
          companyId=""
          onSubmit={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
