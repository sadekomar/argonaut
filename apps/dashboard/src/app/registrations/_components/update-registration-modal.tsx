"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationForm } from "./registration-form";
import { Registration } from "../registrations-table";

type RegistrationStatus =
  | "PURSUING"
  | "REQUIREMENTS_COLLECTED"
  | "DOCS_SENT"
  | "UNDER_REVIEW"
  | "PENDING_CONFIRMATION"
  | "VERIFIED"
  | "ON_HOLD"
  | "DECLINED";

interface UpdateRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: Registration;
}

export function UpdateRegistrationModal({
  open,
  onOpenChange,
  registration,
}: UpdateRegistrationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Registration</DialogTitle>
        </DialogHeader>
        <RegistrationForm
          defaultValues={{
            companyId: registration.companyId,
            registrationStatus: registration.registrationStatus,
            authorId: registration.authorId,
            registrationFile: registration.registrationFile || "",
            notes: registration.notes || "",
          }}
          registrationId={registration.id}
          onSubmit={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
