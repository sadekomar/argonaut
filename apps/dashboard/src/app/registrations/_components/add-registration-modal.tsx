"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegistrationForm } from "./registration-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddRegistrationModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Registration
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Registration</DialogTitle>
        </DialogHeader>
        <RegistrationForm
          defaultValues={{
            companyId: "",
            registrationStatus: "PURSUING",
            authorId: "",
            registrationFile: "",
            notes: "",
          }}
          onSubmit={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
