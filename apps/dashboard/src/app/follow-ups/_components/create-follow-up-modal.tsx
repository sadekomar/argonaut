"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FollowUpForm } from "./follow-up-form";
import { useState } from "react";

export function CreateFollowUpModal({
  defaultValues,
  onOpenChange,
  open,
}: {
  defaultValues?: FollowUpForm;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Follow-Up
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Follow-Up</DialogTitle>
          <DialogDescription>
            Create a new follow-up for a quote.
          </DialogDescription>
        </DialogHeader>
        <FollowUpForm
          defaultValues={defaultValues}
          onSubmit={(data) => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
