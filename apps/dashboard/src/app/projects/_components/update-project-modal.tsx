"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";

interface UpdateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function UpdateProjectModal({
  open,
  onOpenChange,
  projectId,
}: UpdateProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>Update project details.</DialogDescription>
        </DialogHeader>
        <ProjectForm
          projectId={projectId}
          onSubmit={(data) => {
            console.log(data);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
