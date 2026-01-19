import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PeopleClientPage from "./client-page";
import { readPeople, readPeopleMetadata } from "./_utils/read-people";
import { readCompanies } from "../companies/_utils/read-companies";
import { loadPeopleSearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await loadPeopleSearchParams(searchParams);
  const queryClient = new QueryClient();

  // Parallelize all prefetch queries for better performance
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [
        "people",
        {
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          firstName: params.firstName,
          lastName: params.lastName,
          email: params.email,
          phone: params.phone,
          company: params.company,
          type: params.type,
        },
      ],
      queryFn: () =>
        readPeople({
          page: params.page,
          perPage: params.perPage,
          sort: params.sort,
          firstName: params.firstName ?? undefined,
          lastName: params.lastName ?? undefined,
          email: params.email ?? undefined,
          phone: params.phone ?? undefined,
          company: params.company,
          type: params.type,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["peopleMetadata"],
      queryFn: readPeopleMetadata,
    }),
    // Also prefetch companies for the filter dropdown
    queryClient.prefetchQuery({
      queryKey: ["companies", undefined],
      queryFn: () => readCompanies(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PeopleClientPage />
    </HydrationBoundary>
  );
}
