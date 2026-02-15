"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readQuote } from "../_utils/read-quote";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Building2,
  Package,
  Target,
  User,
  DollarSign,
  Users,
  FileQuestion,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreateFollowUpModal } from "@/app/follow-ups/_components/create-follow-up-modal";
import { UpdateFollowUpModal } from "@/app/follow-ups/_components/update-follow-up-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { useDeleteFollowUp } from "@/app/follow-ups/_components/use-follow-ups";
import { useState } from "react";

type QuoteDetail = NonNullable<Awaited<ReturnType<typeof readQuote>>>;
type FollowUpItem = QuoteDetail["FollowUp"][number];

function OutcomeBadge({ outcome }: { outcome: string }) {
  const Icon =
    outcome === "WON" ? CheckCircle : outcome === "LOST" ? XCircle : Clock;

  return (
    <Badge
      variant="outline"
      className={
        outcome === "WON"
          ? "border-green-500 text-green-700 dark:text-green-400"
          : outcome === "LOST"
            ? "border-red-500 text-red-700 dark:text-red-400"
            : "border-yellow-500 text-yellow-700 dark:text-yellow-400"
      }
    >
      <Icon className="mr-1 size-3" />
      {outcome}
    </Badge>
  );
}

export default function QuoteDetailClientPage({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { data: quote } = useQuery({
    queryKey: ["quote", id],
    queryFn: () => readQuote(id),
  });

  const deleteFollowUp = useDeleteFollowUp();

  const [isCreateFollowUpOpen, setIsCreateFollowUpOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpItem>();
  const [isEditFollowUpOpen, setIsEditFollowUpOpen] = useState(false);
  const [isDeleteFollowUpOpen, setIsDeleteFollowUpOpen] = useState(false);

  if (!quote) return null;

  const rfq = quote.Rfq?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/quotes">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{quote.referenceNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(quote.createdAt)}
            </p>
          </div>
          <OutcomeBadge outcome={quote.quoteOutcome} />
        </div>
      </div>

      {/* Quote Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
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
              <p className="mt-1 text-sm">
                {quote.author?.firstName} {quote.author?.lastName}
              </p>
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
                <Users className="size-4" />
                Contact Person
              </label>
              <p className="mt-1 text-sm">
                {quote.contactPerson?.firstName} {quote.contactPerson?.lastName}
              </p>
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
                <OutcomeBadge outcome={quote.quoteOutcome} />
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
            {rfq && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <FileQuestion className="size-4" />
                  RFQ
                </label>
                <p className="mt-1 text-sm">{rfq.referenceNumber}</p>
              </div>
            )}
          </div>

          {quote.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Notes
                </label>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {quote.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Related Files Card */}
      <Card>
        <CardHeader>
          <CardTitle>Related Files</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Follow-ups Card */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Follow-ups</CardTitle>
          <Button size="sm" onClick={() => setIsCreateFollowUpOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Follow-up
          </Button>
        </CardHeader>
        <CardContent>
          {quote.FollowUp && quote.FollowUp.length > 0 ? (
            <div className="space-y-4">
              {quote.FollowUp.map((followUp) => (
                <div
                  key={followUp.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {followUp.author?.firstName} {followUp.author?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(followUp.createdAt)}
                      </span>
                    </div>
                    {followUp.notes && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-6">
                        {followUp.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedFollowUp(followUp);
                        setIsEditFollowUpOpen(true);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedFollowUp(followUp);
                        setIsDeleteFollowUpOpen(true);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No follow-ups yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateFollowUpModal
        open={isCreateFollowUpOpen}
        onOpenChange={(open) => {
          setIsCreateFollowUpOpen(open);
          if (!open) {
            queryClient.invalidateQueries({ queryKey: ["quote", id] });
          }
        }}
        defaultValues={{
          quoteId: quote.id,
          authorId: quote.authorId,
        }}
      />

      {selectedFollowUp && (
        <UpdateFollowUpModal
          open={isEditFollowUpOpen}
          onOpenChange={(open) => {
            setIsEditFollowUpOpen(open);
            if (!open) {
              queryClient.invalidateQueries({ queryKey: ["quote", id] });
            }
          }}
          followUp={{
            ...selectedFollowUp,
            author: {
              id: selectedFollowUp.author.id,
              firstName: selectedFollowUp.author.firstName ?? "",
              lastName: selectedFollowUp.author.lastName ?? "",
            },
            quote: {
              id: quote.id,
              referenceNumber: quote.referenceNumber,
            },
          }}
        />
      )}

      {selectedFollowUp && (
        <DeleteConfirmationModal
          open={isDeleteFollowUpOpen}
          setIsOpen={(open) => {
            setIsDeleteFollowUpOpen(open);
            if (!open) {
              queryClient.invalidateQueries({ queryKey: ["quote", id] });
            }
          }}
          title="Delete Follow-up"
          description="Are you sure you want to delete this follow-up? This action cannot be undone."
          deleteFunction={() => deleteFollowUp.mutate(selectedFollowUp.id)}
        />
      )}
    </div>
  );
}
