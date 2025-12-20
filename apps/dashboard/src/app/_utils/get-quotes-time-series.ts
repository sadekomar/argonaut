"use server";

import { prisma } from "@repo/db";
import { QuoteOutcome } from "@repo/db";

export interface QuoteTimeSeriesDataPoint extends Record<string, string | number> {
  date: string; // ISO date string (YYYY-MM-DD)
  won: number;
  lost: number;
  pending: number;
}

export async function getQuotesTimeSeries(
  days: number = 90
): Promise<QuoteTimeSeriesDataPoint[]> {
  // Calculate the start date
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of today
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0); // Start of day

  // Fetch all quotes within the date range
  const quotes = await prisma.quote.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      date: true,
      quoteOutcome: true,
    },
  });

  // Group quotes by date and outcome, counting quotes
  const dateMap = new Map<string, { won: number; lost: number; pending: number }>();

  for (const quote of quotes) {
    // Format date as YYYY-MM-DD
    const dateKey = quote.date.toISOString().split("T")[0];

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { won: 0, lost: 0, pending: 0 });
    }

    const dateData = dateMap.get(dateKey)!;
    switch (quote.quoteOutcome) {
      case QuoteOutcome.WON:
        dateData.won += 1;
        break;
      case QuoteOutcome.LOST:
        dateData.lost += 1;
        break;
      case QuoteOutcome.PENDING:
        dateData.pending += 1;
        break;
    }
  }

  // Convert map to array and sort by date
  const result: QuoteTimeSeriesDataPoint[] = Array.from(dateMap.entries())
    .map(([date, values]) => ({
      date,
      won: values.won,
      lost: values.lost,
      pending: values.pending,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Fill in missing dates with zeros to ensure continuous data
  const filledResult: QuoteTimeSeriesDataPoint[] = [];
  if (result.length > 0) {
    const firstDate = new Date(result[0].date);
    const lastDate = new Date(result[result.length - 1].date);
    const currentDate = new Date(firstDate);

    let resultIndex = 0;
    while (currentDate <= lastDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      if (
        resultIndex < result.length &&
        result[resultIndex].date === dateKey
      ) {
        filledResult.push(result[resultIndex]);
        resultIndex++;
      } else {
        filledResult.push({
          date: dateKey,
          won: 0,
          lost: 0,
          pending: 0,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return filledResult;
}

