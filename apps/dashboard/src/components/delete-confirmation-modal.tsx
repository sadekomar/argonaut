"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmationModal({
  open,
  setIsOpen,
  title,
  description,
  deleteFunction,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description: string;
  deleteFunction: () => void;
}) {
  const handleConfirm = () => {
    try {
      deleteFunction();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
