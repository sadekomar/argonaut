"use server";

import { prisma } from "@repo/db";
import type { Prisma } from "@repo/db";

interface ReadFollowUpsParams {
  page?: number;
  perPage?: number;
  sort?: Array<{ id: string; desc: boolean }>;
  quote?: string[];
  author?: string[];
  notes?: string;
  createdAt?: string | [string, string];
}

export const readFollowUps = async (params: ReadFollowUpsParams = {}) => {
  const {
    page = 1,
    perPage = 10,
    sort = [{ id: "createdAt", desc: true }],
    quote,
    author,
    notes,
    createdAt,
  } = params;

  // Build where clause from filters
  const where: Prisma.FollowUpWhereInput = {};

  if (quote && quote.length > 0) {
    where.quoteId = {
      in: quote,
    };
  }

  if (author && author.length > 0) {
    where.authorId = {
      in: author,
    };
  }

  if (notes) {
    where.notes = {
      contains: notes,
      mode: "insensitive",
    };
  }

  if (createdAt) {
    // Date can be a timestamp string or comma-separated timestamps for range
    if (typeof createdAt === "string") {
      const parts = createdAt.split(",").filter(Boolean);
      if (parts.length === 2) {
        // Date range
        where.createdAt = {
          gte: new Date(Number(parts[0])),
          lte: new Date(Number(parts[1])),
        };
      } else if (parts.length === 1) {
        // Single date (timestamp)
        const dateObj = new Date(Number(parts[0]));
        where.createdAt = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      }
    } else if (Array.isArray(createdAt) && createdAt.length === 2) {
      where.createdAt = {
        gte: new Date(Number(createdAt[0])),
        lte: new Date(Number(createdAt[1])),
      };
    }
  }

  // Build orderBy from sorting
  const orderBy: Prisma.FollowUpOrderByWithRelationInput[] = sort.map(
    (sortItem) => {
      const order = sortItem.desc ? "desc" : "asc";

      switch (sortItem.id) {
        case "quote":
          return { quote: { referenceNumber: order } };
        case "author":
          return { author: { firstName: order } };
        case "notes":
          return { notes: order };
        case "createdAt":
          return { createdAt: order };
        case "updatedAt":
          return { updatedAt: order };
        default:
          return { createdAt: "desc" };
      }
    }
  );

  // Get total count for pagination
  const total = await prisma.followUp.count({ where });

  // Fetch follow-ups with pagination
  const followUps = await prisma.followUp.findMany({
    where,
    include: {
      quote: {
        select: {
          id: true,
          referenceNumber: true,
        },
      },
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return {
    data: followUps,
    total,
    pageCount: Math.ceil(total / perPage),
  };
};

export const readFollowUpsMetadata = async () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalFollowUps, followUpsThisMonth, followUpsThisWeek] =
    await Promise.all([
      prisma.followUp.count(),
      prisma.followUp.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.followUp.count({
        where: {
          createdAt: {
            gte: startOfWeek,
          },
        },
      }),
    ]);

  return {
    totalFollowUps,
    followUpsThisMonth,
    followUpsThisWeek,
  };
};
