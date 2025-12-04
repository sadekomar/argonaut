"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateRegistrationForm } from "./update-registration-form";

interface UpdateRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
}

export function UpdateRegistrationModal({
  open,
  onOpenChange,
  registrationId,
}: UpdateRegistrationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Registration</DialogTitle>
          <DialogDescription>Update registration details.</DialogDescription>
        </DialogHeader>
        <UpdateRegistrationForm
          registrationId={registrationId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
