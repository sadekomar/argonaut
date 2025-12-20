"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Calendar,
  Building2,
  User,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileCheck,
  Send,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { CompanyType } from "@repo/db";

type RegistrationStatus =
  | "PURSUING"
  | "REQUIREMENTS_COLLECTED"
  | "DOCS_SENT"
  | "UNDER_REVIEW"
  | "PENDING_CONFIRMATION"
  | "VERIFIED"
  | "ON_HOLD"
  | "DECLINED";

interface Registration {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    type: CompanyType;
  };
  registrationStatus: RegistrationStatus;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  registrationFile: string | null;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const getTypeBadgeVariant = (type: CompanyType) => {
  switch (type) {
    case "SUPPLIER":
      return "default";
    case "CLIENT":
      return "secondary";
    case "CONTRACTOR":
      return "outline";
    case "CONSULTANT":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusBadge = (status: RegistrationStatus) => {
  const statusConfig = {
    PURSUING: {
      icon: Clock,
      label: "Pursuing",
      className: "border-blue-500 text-blue-700 dark:text-blue-400",
    },
    REQUIREMENTS_COLLECTED: {
      icon: FileCheck,
      label: "Requirements Collected",
      className: "border-cyan-500 text-cyan-700 dark:text-cyan-400",
    },
    DOCS_SENT: {
      icon: Send,
      label: "Docs Sent",
      className: "border-purple-500 text-purple-700 dark:text-purple-400",
    },
    UNDER_REVIEW: {
      icon: AlertCircle,
      label: "Under Review",
      className: "border-yellow-500 text-yellow-700 dark:text-yellow-400",
    },
    PENDING_CONFIRMATION: {
      icon: Clock,
      label: "Pending Confirmation",
      className: "border-orange-500 text-orange-700 dark:text-orange-400",
    },
    VERIFIED: {
      icon: CheckCircle,
      label: "Verified",
      className: "border-green-500 text-green-700 dark:text-green-400",
    },
    ON_HOLD: {
      icon: Pause,
      label: "On Hold",
      className: "border-gray-500 text-gray-700 dark:text-gray-400",
    },
    DECLINED: {
      icon: XCircle,
      label: "Declined",
      className: "border-red-500 text-red-700 dark:text-red-400",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="mr-1 size-3" />
      {config.label}
    </Badge>
  );
};

interface ViewRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: Registration;
}

export function ViewRegistrationModal({
  open,
  onOpenChange,
  registration,
}: ViewRegistrationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogTitle>View Registration</DialogTitle>
        <div className="space-y-6">
          {/* Registration Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-4" />
                Company
              </label>
              <p className="mt-1 text-sm font-medium">
                {registration.company.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Tag className="size-4" />
                Company Type
              </label>
              <p className="mt-1">
                <Badge variant={getTypeBadgeVariant(registration.company.type)}>
                  {registration.company.type}
                </Badge>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Registration Status
              </label>
              <p className="mt-1">{getStatusBadge(registration.registrationStatus)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="size-4" />
                Author
              </label>
              <p className="mt-1 text-sm">{registration.author.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-4" />
                Created At
              </label>
              <p className="mt-1 text-sm">{formatDate(registration.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-4" />
                Updated At
              </label>
              <p className="mt-1 text-sm">{formatDate(registration.updatedAt)}</p>
            </div>
          </div>

          {registration.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{registration.notes}</p>
            </div>
          )}

          {/* Registration File */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Registration File
            </label>
            {registration.registrationFile ? (
              <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Registration File</p>
                    <p className="text-xs text-muted-foreground text-wrap truncate">
                      {registration.registrationFile}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <a
                    href={`/api/upload/${encodeURIComponent(registration.registrationFile)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    View
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No file associated with this registration.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

