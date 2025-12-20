"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rfq } from "./use-rfqs";
import {
  FileText,
  Calendar,
  Building2,
  Package,
  Target,
  User,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ViewRfqModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: Rfq;
}

export function ViewRfqModal({ open, onOpenChange, rfq }: ViewRfqModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogTitle>View RFQ</DialogTitle>
        <div className="space-y-6">
          {/* RFQ Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Reference Number
              </label>
              <p className="mt-1 text-sm font-medium">{rfq.referenceNumber}</p>
            </div>
            {rfq.quote && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <FileText className="size-4" />
                  Associated Quote
                </label>
                <p className="mt-1 text-sm font-medium">
                  {rfq.quote.referenceNumber}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-4" />
                Date
              </label>
              <p className="mt-1 text-sm">
                {rfq.date ? formatDate(rfq.date) : ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Package className="size-4" />
                Supplier
              </label>
              <p className="mt-1 text-sm">{rfq.supplier.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Target className="size-4" />
                Project
              </label>
              <p className="mt-1 text-sm">{rfq.project.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="size-4" />
                Value
              </label>
              <p className="mt-1 text-sm font-medium">
                {formatCurrency(rfq.value, rfq.currency)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Currency
              </label>
              <p className="mt-1">
                <Badge variant="outline">{rfq.currency}</Badge>
              </p>
            </div>
            {rfq.rfqReceivedAt && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  RFQ Received Date
                </label>
                <p className="mt-1 text-sm">{formatDate(rfq.rfqReceivedAt)}</p>
              </div>
            )}
          </div>

          {rfq.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{rfq.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
