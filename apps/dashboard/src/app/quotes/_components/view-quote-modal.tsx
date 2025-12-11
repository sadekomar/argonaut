"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quote } from "./quotes-table";
import {
  FileText,
  Download,
  Calendar,
  Building2,
  Package,
  Target,
  User,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ViewQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote;
}

export function ViewQuoteModal({
  open,
  onOpenChange,
  quote,
}: ViewQuoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogTitle>View Quote</DialogTitle>
        <div className="space-y-6">
          {/* Quote Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Reference Number
              </label>
              <p className="mt-1 text-sm font-medium">
                {quote.referenceNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-4" />
                Date
              </label>
              <p className="mt-1 text-sm">{formatDate(quote.date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="size-4" />
                Author
              </label>
              <p className="mt-1 text-sm">{quote.author.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-4" />
                Client
              </label>
              <p className="mt-1 text-sm">{quote.client.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Package className="size-4" />
                Supplier
              </label>
              <p className="mt-1 text-sm">{quote.supplier?.name ?? "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Target className="size-4" />
                Project
              </label>
              <p className="mt-1 text-sm">{quote.project.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="size-4" />
                Value
              </label>
              <p className="mt-1 text-sm font-medium">
                {formatCurrency(quote.value, quote.currency)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Currency
              </label>
              <p className="mt-1">
                <Badge variant="outline">{quote.currency}</Badge>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Outcome
              </label>
              <p className="mt-1">
                <Badge variant="outline">{quote.quoteOutcome}</Badge>
              </p>
            </div>
            {quote.approximateSiteDeliveryDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  Approx. Site Delivery Date
                </label>
                <p className="mt-1 text-sm">
                  {formatDate(quote.approximateSiteDeliveryDate)}
                </p>
              </div>
            )}
          </div>

          {quote.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {/* Related Files */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Related Files
            </label>
            {quote.objectKeys && quote.objectKeys.length > 0 ? (
              <div className="space-y-2">
                {quote.objectKeys.map((objectKey, index) => (
                  <div
                    key={objectKey}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          File {index + 1}
                        </p>
                        <p className="text-xs text-muted-foreground text-wrap truncate">
                          {objectKey}
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
                        href={`/api/upload/${encodeURIComponent(objectKey)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No files associated with this quote.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
