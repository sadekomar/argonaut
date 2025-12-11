"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FollowUpForm } from "./follow-up-form";
import { FollowUp } from "../follow-ups-table";

interface UpdateFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUp: FollowUp;
}

export function UpdateFollowUpModal({
  open,
  onOpenChange,
  followUp,
}: UpdateFollowUpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Follow-Up</DialogTitle>
          <DialogDescription>Update follow-up details.</DialogDescription>
        </DialogHeader>
        <FollowUpForm
          followUpId={followUp.id}
          defaultValues={{
            quoteId: followUp.quoteId,
            authorId: followUp.authorId,
            notes: followUp.notes || "",
          }}
          onSubmit={(data) => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
