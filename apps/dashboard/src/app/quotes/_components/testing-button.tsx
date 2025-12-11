"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useCreateQuote } from "./use-quotes";
import React from "react";
import { getSortingStateParser } from "@/lib/parsers";
import { Quote } from "./quotes-table";

// You may want to use your UI lib's Button, here's a placeholder:
function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} />;
}

export function TestingButton() {
  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () =>
      new Set([
        "referenceNumber",
        "date",
        "client",
        "supplier",
        "project",
        "author",
        "value",
        "currency",
        "quoteOutcome",
        "approximateSiteDeliveryDate",
      ]),
    []
  );

  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Quote>(columnIds).withDefault([])
  );
  // Read URL query state for filters
  const [filters] = useQueryStates({
    date: parseAsString,
    referenceNumber: parseAsString.withDefault(""),
    client: parseAsArrayOf(parseAsString).withDefault([]),
    supplier: parseAsArrayOf(parseAsString).withDefault([]),
    project: parseAsArrayOf(parseAsString).withDefault([]),
    author: parseAsArrayOf(parseAsString).withDefault([]),
    currency: parseAsArrayOf(parseAsString).withDefault([]),
    quoteOutcome: parseAsArrayOf(parseAsString).withDefault([]),
    approximateSiteDeliveryDate: parseAsString,
  });

  const createQuote = useCreateQuote({
    page: pagination.page,
    perPage: pagination.perPage,
    sort: sort,
    date: filters.date ?? undefined,
    referenceNumber: filters.referenceNumber,
    client: filters.client,
    supplier: filters.supplier,
    project: filters.project,
    author: filters.author,
    currency: filters.currency,
    quoteOutcome: filters.quoteOutcome,
    approximateSiteDeliveryDate:
      filters.approximateSiteDeliveryDate ?? undefined,
  });

  // Dummy data for creating a quote
  const dummyQuote = {
    date: "2024-06-01",
    currency: "EGP" as const,
    value: "0",
    authorId: "5ea1d607-0358-480d-944d-b3b5eb986a6c",
    supplierId: "77e9568a-f083-4cd8-ab35-b309ff244264",
    clientId: "4ae3986c-4735-4f5c-bd77-5508bbdcf60a",
    projectId: "bde6bf50-f689-4462-85df-e6b7014467f5",
    contactPersonId: "127baea8-f6fe-4c25-9b8b-d24cadcc0491",
    objectKeys: ["file-1"],
    referenceNumber: "TEST-REF-001",
    notes: "This is a dummy test quote.",
    quoteOutcome: "PENDING" as const,
    approximateSiteDeliveryDate: "2024-07-01",
    authorName: "Jane Doe",
    supplierName: "Supplier Inc.",
    clientName: "Acme Corporation",
    projectName: "Project Alpha",
    contactPersonName: "John Smith",
  };

  return (
    <div>
      <Button
        onClick={() => createQuote.mutate(dummyQuote)}
        style={{
          padding: "8px 16px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Create Quote
      </Button>
    </div>
  );
}
