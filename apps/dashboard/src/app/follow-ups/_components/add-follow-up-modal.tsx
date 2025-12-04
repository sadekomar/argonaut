"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFollowUpForm } from "./add-follow-up-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddFollowUpModal() {
  return (
    <Dialog>
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
        <AddFollowUpForm />
      </DialogContent>
    </Dialog>
  );
}

