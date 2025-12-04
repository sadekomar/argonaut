"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddRegistrationForm } from "./add-registration-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddRegistrationModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Registration
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Registration</DialogTitle>
          <DialogDescription>
            Create a new registration for a company.
          </DialogDescription>
        </DialogHeader>
        <AddRegistrationForm />
      </DialogContent>
    </Dialog>
  );
}
