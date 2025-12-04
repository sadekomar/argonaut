"use client";

import {
  GetQuotesResponse,
  useGetQuotes,
  useGetQuotesMetadata,
} from "./_components/use-quotes";
import { QuotesTable } from "./_components/quotes-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteForm } from "./_components/quote-form";
import { generateEmptyMonths } from "@/lib/utils";
import { AddQuoteModal } from "./_components/add-quote-modal";

export default function QuotesAllPage() {
  const [
    { data: quotes, isPending },
    { data: quotesMetadata, isPending: quotesMetadataPending },
  ] = [useGetQuotes({ perPage: 1000 }), useGetQuotesMetadata()];

  const chartData = getChartData(quotes);

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quotes</h1>
          <AddQuoteModal />
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
              <QuotesTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function getChartData(
  quotes: GetQuotesResponse | undefined
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
