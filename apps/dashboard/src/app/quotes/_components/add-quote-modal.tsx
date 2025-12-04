"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuoteForm } from "./quote-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddQuoteModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Quote</DialogTitle>
          <DialogDescription>
            Create a new quote in the system.
          </DialogDescription>
        </DialogHeader>
        <QuoteForm
          onSubmit={(data) => {
            console.log(data);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
