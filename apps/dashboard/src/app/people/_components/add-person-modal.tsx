"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PersonForm } from "./person-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddPersonModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
          <DialogDescription>
            Create a new person in the system.
          </DialogDescription>
        </DialogHeader>
        <PersonForm
          defaultValues={{
            name: "",
            email: "",
            phone: "",
            companyId: "",
            type: "INTERNAL",
          }}
          personId=""
          onSubmit={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
