"use server";

import { getQuotesForExport, type ReadQuotesParams } from "./read-quotes";
import { formatCurrency, formatDate } from "@/lib/utils";

const CSV_LIMIT = 10000;

function escapeCsvField(value: string): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function quoteToRow(quote: Awaited<ReturnType<typeof getQuotesForExport>>[number]): string[] {
  const authorName = [quote.author?.firstName, quote.author?.lastName].filter(Boolean).join(" ") || "";
  const contactName = [quote.contactPerson?.firstName, quote.contactPerson?.lastName].filter(Boolean).join(" ") || "";
  const salesPersonName = [quote.salesPerson?.firstName, quote.salesPerson?.lastName].filter(Boolean).join(" ") || "";
  return [
    quote.referenceNumber,
    formatDate(quote.date),
    authorName,
    salesPersonName,
    quote.client?.name ?? "",
    quote.supplier?.name ?? "",
    quote.project?.name ?? "",
    contactName,
    formatCurrency(quote.value, quote.currency),
    quote.currency,
    quote.quoteOutcome,
    quote.approximateSiteDeliveryDate ? formatDate(quote.approximateSiteDeliveryDate) : "",
    quote.notes ?? "",
  ];
}

export async function exportQuotesToCsv(
  params: Omit<ReadQuotesParams, "page" | "perPage"> = {}
): Promise<string> {
  const quotes = await getQuotesForExport(params, CSV_LIMIT);

  const headers = [
    "Reference Number",
    "Date",
    "Author",
    "Sales Person",
    "Client",
    "Supplier",
    "Project",
    "Contact Person",
    "Value",
    "Currency",
    "Outcome",
    "Approx. Site Delivery Date",
    "Notes",
  ];

  const rows = quotes.map((q) => quoteToRow(q));
  const headerLine = headers.map(escapeCsvField).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvField).join(","));
  const lines = [headerLine, ...dataLines];
  return lines.join("\r\n");
}
