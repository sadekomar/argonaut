import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "./quote-form";
import { Quote } from "./quotes-table";

// Helper function to format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

interface EditQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote;
}

export function EditQuoteModal({
  open,
  onOpenChange,
  quote,
}: EditQuoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Edit Quote</DialogTitle>
        <QuoteForm
          quoteId={quote.id}
          defaultValues={{
            referenceNumber: quote.referenceNumber,
            date: formatDateForInput(quote.date),
            currency: quote.currency,
            value: quote.value.toString(),
            authorId: quote.authorId,
            supplierId: quote.supplierId || "",
            clientId: quote.clientId,
            projectId: quote.projectId,
            contactPersonId: quote.contactPersonId,
            salesPersonId: quote.salesPersonId || "",
            approximateSiteDeliveryDate: formatDateForInput(
              quote.approximateSiteDeliveryDate
            ),
            notes: quote.notes || "",
            quoteOutcome: quote.quoteOutcome || undefined,
            objectKeys: quote.objectKeys,
          }}
          onSubmit={(data) => {
            console.log(data);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
