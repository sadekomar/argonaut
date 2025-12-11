import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RfqForm } from "./rfq-form";
import { Rfq } from "./use-rfqs";
import { Currency } from "@/lib/enums";

// Helper function to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

interface EditRfqModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: Rfq;
}

export function EditRfqModal({ open, onOpenChange, rfq }: EditRfqModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Edit RFQ</DialogTitle>
        <RfqForm
          rfqId={rfq.id}
          defaultValues={{
            referenceNumber: rfq.referenceNumber,
            date: formatDateForInput(rfq.date),
            currency: rfq.currency as Currency,
            value: rfq.value.toString(),
            authorId: rfq.authorId,
            supplierId: rfq.supplierId,
            clientId: rfq.clientId,
            projectId: rfq.projectId,
            quoteId: rfq.quoteId || "",
            rfqReceivedAt: formatDateForInput(rfq.rfqReceivedAt),
            notes: rfq.notes || "",
            quoteReferenceNumber: rfq.quote?.referenceNumber,
          }}
          onSubmit={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
