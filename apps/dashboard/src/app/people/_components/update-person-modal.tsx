"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdatePersonForm } from "./update-person-form";

interface UpdatePersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
}

export function UpdatePersonModal({
  open,
  onOpenChange,
  personId,
}: UpdatePersonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Person</DialogTitle>
          <DialogDescription>Update person details.</DialogDescription>
        </DialogHeader>
        <UpdatePersonForm
          personId={personId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
