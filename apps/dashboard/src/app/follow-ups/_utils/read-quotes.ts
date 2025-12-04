"use server";

import { prisma } from "@repo/db";

export const readQuotes = async () => {
  const quotes = await prisma.quote.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      referenceNumber: true,
    },
  });

  const quoteOptions = quotes.map((quote) => ({
    value: quote.id,
    label: quote.referenceNumber,
  }));

  return quoteOptions;
};

