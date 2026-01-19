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

// Common search params shared across all pages
const commonSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(40),
};

// Quotes-specific search params
export const quotesSearchParams = {
  ...commonSearchParams,
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
};

// Registrations-specific search params
export const registrationsSearchParams = {
  ...commonSearchParams,
  company: parseAsString,
  companyType: parseAsArrayOf(parseAsString).withDefault([]),
  registrationStatus: parseAsArrayOf(parseAsString).withDefault([]),
  author: parseAsString,
  createdAt: parseAsString,
  sort: getSortingStateParser<{ id: string }>(
    new Set(["company", "companyType", "registrationStatus", "author", "createdAt"])
  ).withDefault([{ id: "createdAt", desc: true }]),
};

// Companies-specific search params
export const companiesSearchParams = {
  ...commonSearchParams,
  name: parseAsString,
  email: parseAsString,
  phone: parseAsString,
  type: parseAsArrayOf(parseAsString).withDefault([]),
  sort: getSortingStateParser<{ id: string }>(
    new Set(["name", "email", "phone", "type", "createdAt"])
  ).withDefault([{ id: "createdAt", desc: true }]),
};

// People-specific search params
export const peopleSearchParams = {
  ...commonSearchParams,
  firstName: parseAsString,
  lastName: parseAsString,
  email: parseAsString,
  phone: parseAsString,
  company: parseAsArrayOf(parseAsString).withDefault([]),
  type: parseAsArrayOf(parseAsString).withDefault([]),
  sort: getSortingStateParser<{ id: string }>(
    new Set(["firstName", "lastName", "email", "phone", "company", "type", "createdAt"])
  ).withDefault([{ id: "createdAt", desc: true }]),
};

// Keep the original loader for quotes (backward compatibility)
export const loadSearchParams = createLoader(quotesSearchParams);

// Create loaders for each page type
export const loadRegistrationsSearchParams = createLoader(registrationsSearchParams);
export const loadCompaniesSearchParams = createLoader(companiesSearchParams);
export const loadPeopleSearchParams = createLoader(peopleSearchParams);
