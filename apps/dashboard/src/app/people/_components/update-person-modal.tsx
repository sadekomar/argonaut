"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonForm } from "./person-form";
import { Person } from "../persons-table";

type PersonType = "AUTHOR" | "CONTACT_PERSON" | "INTERNAL";

interface UpdatePersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: Person;
}

export function UpdatePersonModal({
  open,
  onOpenChange,
  person,
}: UpdatePersonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>
        <PersonForm
          defaultValues={{
            firstName: person.firstName || "",
            lastName: person.lastName || "",
            email: person.email || "",
            phone: person.phone || "",
            companyId: person.companyId || "",
            type: person.type as PersonType,
          }}
          personId={person.id}
          onSubmit={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
