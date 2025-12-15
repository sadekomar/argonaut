"use server";

import { prisma } from "@repo/db";
import type { Currency, Prisma, QuoteOutcome } from "@repo/db";

interface ReadQuotesParams {
  page?: number;
  perPage?: number;
  sort?: Array<{ id: string; desc: boolean }>;
  referenceNumber?: string;
  date?: string | [string, string];
  client?: string[];
  supplier?: string[];
  project?: string[];
  author?: string[];
  currency?: string[];
  quoteOutcome?: string[];
  approximateSiteDeliveryDate?: string | [string, string];
  rfq?: null | string;
}

// Helper function to build where clause from filters
function buildWhereClause(
  params: Omit<ReadQuotesParams, "page" | "perPage" | "sort">
): Prisma.QuoteWhereInput {
  const {
    referenceNumber,
    date,
    client,
    supplier,
    project,
    author,
    currency,
    quoteOutcome,
    approximateSiteDeliveryDate,
    rfq,
  } = params;

  const where: Prisma.QuoteWhereInput = {};

  if (referenceNumber) {
    where.referenceNumber = {
      contains: referenceNumber,
      mode: "insensitive",
    };
  }

  if (date) {
    // Date can be a timestamp string or comma-separated timestamps for range
    if (typeof date === "string") {
      const parts = date.split(",").filter(Boolean);
      if (parts.length === 2) {
        // Date range
        where.date = {
          gte: new Date(Number(parts[0])),
          lte: new Date(Number(parts[1])),
        };
      } else if (parts.length === 1) {
        // Single date (timestamp)
        const dateObj = new Date(Number(parts[0]));
        where.date = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      }
    } else if (Array.isArray(date) && date.length === 2) {
      where.date = {
        gte: new Date(Number(date[0])),
        lte: new Date(Number(date[1])),
      };
    }
  }

  if (client && client.length > 0) {
    where.clientId = {
      in: client,
    };
  }

  if (supplier && supplier.length > 0) {
    where.supplierId = {
      in: supplier,
    };
  }

  if (project && project.length > 0) {
    where.projectId = {
      in: project,
    };
  }

  if (author && author.length > 0) {
    where.authorId = {
      in: author,
    };
  }

  if (currency && currency.length > 0) {
    where.currency = {
      in: currency as Currency[],
    };
  }

  if (quoteOutcome && quoteOutcome.length > 0) {
    where.quoteOutcome = {
      in: quoteOutcome as QuoteOutcome[],
    };
  }

  if (approximateSiteDeliveryDate) {
    // Date can be a timestamp string or comma-separated timestamps for range
    if (typeof approximateSiteDeliveryDate === "string") {
      const parts = approximateSiteDeliveryDate.split(",").filter(Boolean);
      if (parts.length === 2) {
        // Date range
        where.approximateSiteDeliveryDate = {
          gte: new Date(Number(parts[0])),
          lte: new Date(Number(parts[1])),
        };
      } else if (parts.length === 1) {
        // Single date (timestamp)
        const dateObj = new Date(Number(parts[0]));
        where.approximateSiteDeliveryDate = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      }
    } else if (
      Array.isArray(approximateSiteDeliveryDate) &&
      approximateSiteDeliveryDate.length === 2
    ) {
      where.approximateSiteDeliveryDate = {
        gte: new Date(Number(approximateSiteDeliveryDate[0])),
        lte: new Date(Number(approximateSiteDeliveryDate[1])),
      };
    }
  }

  // Filter by RFQ association
  // If rfq is null, fetch quotes that have no associated RFQ
  // If rfq is undefined, fetch all quotes (no filter)
  if (rfq === null) {
    where.Rfq = {
      none: {},
    };
  }

  return where;
}

export const readQuotes = async (params: ReadQuotesParams = {}) => {
  const { page, perPage, sort = [{ id: "date", desc: true }] } = params;

  // Build where clause from filters
  const where = buildWhereClause(params);

  // Build orderBy from sorting
  const orderBy: Prisma.QuoteOrderByWithRelationInput[] = sort.map(
    (sortItem) => {
      const order = sortItem.desc ? "desc" : "asc";

      switch (sortItem.id) {
        case "referenceNumber":
          return { referenceNumber: order };
        case "date":
          return { date: order };
        case "client":
          return { client: { name: order } };
        case "supplier":
          return { supplier: { name: order } };
        case "project":
          return { project: { name: order } };
        case "author":
          return { author: { name: order } };
        case "value":
          return { value: order };
        case "currency":
          return { currency: order };
        case "quoteOutcome":
          return { quoteOutcome: order };
        case "approximateSiteDeliveryDate":
          return { approximateSiteDeliveryDate: order };
        default:
          return { createdAt: "desc" };
      }
    }
  );

  // Get total count for pagination
  const total = await prisma.quote.count({ where });

  // Fetch quotes with pagination
  const quotes = await prisma.quote.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      supplier: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      contactPerson: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
    skip: page && perPage ? (page - 1) * perPage : undefined,
    take: page && perPage ? perPage : undefined,
  });

  return {
    data: quotes,
    total,
    pageCount: page && perPage ? Math.ceil(total / perPage) : undefined,
  };
};

export const readQuotesMetadata = async (
  params: Omit<ReadQuotesParams, "page" | "perPage" | "sort"> = {}
) => {
  // Build base where clause from filters (excluding quoteOutcome to avoid double filtering)
  const baseWhere = buildWhereClause(params);

  // For outcome-specific counts, combine base filters with outcome filter
  // Note: We exclude quoteOutcome from base filters when counting by outcome
  // to get accurate counts for each outcome category
  const { quoteOutcome, ...filtersWithoutOutcome } = params;
  const baseWhereWithoutOutcome = buildWhereClause(filtersWithoutOutcome);

  const [totalQuotes, wonQuotes, pendingQuotes, lostQuotes] = await Promise.all(
    [
      prisma.quote.count({ where: baseWhere }),
      prisma.quote.count({
        where: {
          ...baseWhereWithoutOutcome,
          quoteOutcome: "WON",
        },
      }),
      prisma.quote.count({
        where: {
          ...baseWhereWithoutOutcome,
          quoteOutcome: "PENDING",
        },
      }),
      prisma.quote.count({
        where: {
          ...baseWhereWithoutOutcome,
          quoteOutcome: "LOST",
        },
      }),
    ]
  );

  return {
    totalQuotes,
    wonQuotes,
    pendingQuotes,
    lostQuotes,
  };
};
