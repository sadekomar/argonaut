"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonForm } from "./person-form";

type PersonType = "AUTHOR" | "CONTACT_PERSON" | "INTERNAL";

interface Person {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: PersonType;
  companyId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

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
            name: person.name,
            email: person.email || "",
            phone: person.phone || "",
            companyId: person.companyId || "",
            type: person.type,
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
