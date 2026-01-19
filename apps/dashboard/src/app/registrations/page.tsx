import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import RegistrationsClientPage from "./client-page";
import {
  readRegistrations,
  readRegistrationsMetadata,
} from "./_utils/read-registrations";
import { loadRegistrationsSearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await loadRegistrationsSearchParams(searchParams);
  const queryClient = new QueryClient();

  // Parallelize all prefetch queries for better performance
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        "registrations",
        {
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          company: params.company,
          companyType: params.companyType,
          registrationStatus: params.registrationStatus,
          author: params.author,
        },
      ],
      queryFn: () =>
        readRegistrations({
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          company: params.company ?? undefined,
          companyType: params.companyType,
          registrationStatus: params.registrationStatus,
          author: params.author ?? undefined,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["registrationsMetadata"],
      queryFn: readRegistrationsMetadata,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RegistrationsClientPage />
    </HydrationBoundary>
  );
}
