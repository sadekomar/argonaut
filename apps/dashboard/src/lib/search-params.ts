import {
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  createLoader,
} from "nuqs/server";
import { getSortingStateParser } from "@/lib/parsers";
import type { Quote } from "@/app/quotes/_components/quotes-table";

const quoteColumnIds = [
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
];

export const quotesSearchParams = {
  date: parseAsString,
  referenceNumber: parseAsString.withDefault(""),
  client: parseAsArrayOf(parseAsString).withDefault([]),
  supplier: parseAsArrayOf(parseAsString).withDefault([]),
  project: parseAsArrayOf(parseAsString).withDefault([]),
  author: parseAsArrayOf(parseAsString).withDefault([]),
  currency: parseAsArrayOf(parseAsString).withDefault([]),
  quoteOutcome: parseAsArrayOf(parseAsString).withDefault([]),
  approximateSiteDeliveryDate: parseAsString,
  sort: getSortingStateParser<Quote>(quoteColumnIds).withDefault([]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(40),
};

export const loadSearchParams = createLoader(quotesSearchParams);
