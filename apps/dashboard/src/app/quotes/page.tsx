import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QuotesClientPage from "./client-page";
import { readQuotes, readQuotesMetadata } from "./_utils/read-quotes";
import { readCompanies } from "../companies/_utils/read-companies";
import { readPeople } from "../people/_utils/read-people";
import { CompanyType, PersonType } from "@/lib/enums";
import { readProjects } from "../projects/_utils/read-projects";
import { loadSearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await loadSearchParams(searchParams);
  const queryClient = new QueryClient();

  // Parallelize all prefetch queries for better performance
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["quotes", params],
      queryFn: () =>
        readQuotes({
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          referenceNumber: params.referenceNumber,
          date: params.date ?? undefined,
          client: params.client,
          supplier: params.supplier,
          project: params.project,
          author: params.author,
          currency: params.currency,
          quoteOutcome: params.quoteOutcome,
          approximateSiteDeliveryDate:
            params.approximateSiteDeliveryDate ?? undefined,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: [
        "quotesMetadata",
        {
          referenceNumber: params.referenceNumber,
          date: params.date,
          client: params.client,
          supplier: params.supplier,
          project: params.project,
          author: params.author,
          currency: params.currency,
          quoteOutcome: params.quoteOutcome,
          approximateSiteDeliveryDate: params.approximateSiteDeliveryDate,
        },
      ],
      queryFn: () =>
        readQuotesMetadata({
          referenceNumber: params.referenceNumber,
          date: params.date ?? undefined,
          client: params.client,
          supplier: params.supplier,
          project: params.project,
          author: params.author,
          currency: params.currency,
          quoteOutcome: params.quoteOutcome,
          approximateSiteDeliveryDate:
            params.approximateSiteDeliveryDate ?? undefined,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["projects", null],
      queryFn: () => readProjects(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["people", { type: [PersonType.AUTHOR] }],
      queryFn: () => readPeople({ type: [PersonType.AUTHOR] }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["companies", { type: [CompanyType.CLIENT] }],
      queryFn: () => readCompanies({ type: [CompanyType.CLIENT] }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["companies", { type: [CompanyType.SUPPLIER] }],
      queryFn: () => readCompanies({ type: [CompanyType.SUPPLIER] }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuotesClientPage />
    </HydrationBoundary>
  );
}
