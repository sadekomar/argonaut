"use client";

import {
  ReadQuotesResponse,
  useReadQuotes,
  useReadQuotesMetadata,
} from "./_components/use-quotes";
import { QuotesTable } from "./_components/quotes-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateEmptyMonths } from "@/lib/utils";
import { AddQuoteModal } from "./_components/add-quote-modal";
import { Suspense } from "react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { readQuotesMetadata } from "./_utils/read-quotes";
import { TestingButton } from "./_components/testing-button";

export default function QuotesClientPage() {
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

  const { data: quotesMetadata, isPending: quotesMetadataPending } = useQuery({
    queryKey: ["quotesMetadata", { ...filters }],
    queryFn: () =>
      readQuotesMetadata({
        approximateSiteDeliveryDate:
          filters.approximateSiteDeliveryDate ?? undefined,
        referenceNumber: filters.referenceNumber,
        date: filters.date ?? undefined,
        client: filters.client,
        supplier: filters.supplier,
        project: filters.project,
        author: filters.author,
        currency: filters.currency,
        quoteOutcome: filters.quoteOutcome,
      }),
  });

  // const { data: quotesMetadata, isPending: quotesMetadataPending } =
  //   useReadQuotesMetadata({
  //     referenceNumber: filters.referenceNumber,
  //     date: filters.date ?? undefined,
  //     client: filters.client,
  //     supplier: filters.supplier,
  //     project: filters.project,
  //     author: filters.author,
  //     currency: filters.currency,
  //     quoteOutcome: filters.quoteOutcome,
  //     approximateSiteDeliveryDate:
  //       filters.approximateSiteDeliveryDate ?? undefined,
  //   });

  // const chartData = getChartData(quotes);

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quotes</h1>
          <AddQuoteModal />
          <TestingButton />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {quotesMetadataPending ? (
                <Skeleton className="h-10 w-10" />
              ) : (
                <p className="text-4xl font-bold">
                  {quotesMetadata?.totalQuotes ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Won Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {quotesMetadata?.wonQuotes != undefined ? (
                <p className="text-4xl font-bold">{quotesMetadata.wonQuotes}</p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {quotesMetadata?.pendingQuotes != undefined ? (
                <p className="text-4xl font-bold">
                  {quotesMetadata.pendingQuotes}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense>
                <QuotesTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function getChartData(
  quotes: ReadQuotesResponse | undefined
): { date: string; quotes: number }[] {
  const allMonths = generateEmptyMonths("2023-06-01", "2025-06-01");

  const chartData = quotes?.data?.reduce(
    (acc: Record<string, number>, quote: { date: Date | string }) => {
      const date = new Date(quote.date);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const key = `${year}-${month}-01`;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const formattedChartData: { date: string; quotes: number }[] = allMonths.map(
    (month) => ({
      date: month,
      quotes: chartData?.[month] || 0,
    })
  );

  return formattedChartData;
}
