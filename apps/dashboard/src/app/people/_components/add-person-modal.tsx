"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPersonForm } from "./add-person-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddPersonModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
          <DialogDescription>
            Create a new person in the system.
          </DialogDescription>
        </DialogHeader>
        <AddPersonForm />
      </DialogContent>
    </Dialog>
  );
}
