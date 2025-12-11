"use server";

import { prisma } from "@repo/db";
import type { Currency, Prisma } from "@repo/db";

interface ReadRfqsParams {
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
  rfqReceivedAt?: string | [string, string];
}

export const readRfqs = async (params: ReadRfqsParams = {}) => {
  const {
    page = 1,
    perPage = 10,
    sort = [{ id: "date", desc: true }],
    referenceNumber,
    date,
    client,
    supplier,
    project,
    author,
    currency,
    rfqReceivedAt,
  } = params;

  // Build where clause from filters
  const where: Prisma.RfqWhereInput = {};

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

  if (rfqReceivedAt) {
    // Date can be a timestamp string or comma-separated timestamps for range
    if (typeof rfqReceivedAt === "string") {
      const parts = rfqReceivedAt.split(",").filter(Boolean);
      if (parts.length === 2) {
        // Date range
        where.rfqReceivedAt = {
          gte: new Date(Number(parts[0])),
          lte: new Date(Number(parts[1])),
        };
      } else if (parts.length === 1) {
        // Single date (timestamp)
        const dateObj = new Date(Number(parts[0]));
        where.rfqReceivedAt = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      }
    } else if (Array.isArray(rfqReceivedAt) && rfqReceivedAt.length === 2) {
      where.rfqReceivedAt = {
        gte: new Date(Number(rfqReceivedAt[0])),
        lte: new Date(Number(rfqReceivedAt[1])),
      };
    }
  }

  // Build orderBy from sorting
  const orderBy: Prisma.RfqOrderByWithRelationInput[] = sort.map((sortItem) => {
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
      case "rfqReceivedAt":
        return { rfqReceivedAt: order };
      default:
        return { createdAt: "desc" };
    }
  });

  // Get total count for pagination
  const total = await prisma.rfq.count({ where });

  // Fetch RFQs with pagination
  const rfqs = await prisma.rfq.findMany({
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
      quote: {
        select: {
          id: true,
          referenceNumber: true,
        },
      },
    },
    orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return {
    data: rfqs,
    total,
    pageCount: Math.ceil(total / perPage),
  };
};

export const readRfq = async (id: string) => {
  const rfq = await prisma.rfq.findUnique({
    where: { id },
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
      quote: {
        select: {
          id: true,
          referenceNumber: true,
        },
      },
    },
  });

  return rfq;
};

export const readRfqsMetadata = async () => {
  const [totalRfqs, rfqsWithQuotes, rfqsReceived, rfqsPending] =
    await Promise.all([
      prisma.rfq.count(),
      prisma.rfq.count({
        where: {
          quoteId: { not: null },
        },
      }),
      prisma.rfq.count({
        where: {
          rfqReceivedAt: { not: null },
        },
      }),
      prisma.rfq.count({
        where: {
          quoteId: null,
        },
      }),
    ]);

  return {
    totalRfqs,
    rfqsWithQuotes,
    rfqsReceived,
    rfqsPending,
  };
};
