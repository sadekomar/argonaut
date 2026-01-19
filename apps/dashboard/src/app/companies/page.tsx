import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CompaniesClientPage from "./client-page";
import { readCompanies, readCompaniesMetadata } from "./_utils/read-companies";
import { loadCompaniesSearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await loadCompaniesSearchParams(searchParams);
  const queryClient = new QueryClient();

  // Parallelize all prefetch queries for better performance
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        "companies",
        {
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          name: params.name,
          email: params.email,
          phone: params.phone,
          type: params.type,
        },
      ],
      queryFn: () =>
        readCompanies({
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          name: params.name ?? undefined,
          email: params.email ?? undefined,
          phone: params.phone ?? undefined,
          type: params.type,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["companiesMetadata"],
      queryFn: readCompaniesMetadata,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompaniesClientPage />
    </HydrationBoundary>
  );
}
