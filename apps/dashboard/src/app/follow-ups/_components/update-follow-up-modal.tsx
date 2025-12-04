"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateFollowUpForm } from "./update-follow-up-form";

interface UpdateFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUpId: string;
}

export function UpdateFollowUpModal({
  open,
  onOpenChange,
  followUpId,
}: UpdateFollowUpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Follow-Up</DialogTitle>
          <DialogDescription>Update follow-up details.</DialogDescription>
        </DialogHeader>
        <UpdateFollowUpForm
          followUpId={followUpId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

