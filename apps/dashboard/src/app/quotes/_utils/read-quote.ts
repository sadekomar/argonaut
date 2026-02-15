"use server";

import { prisma } from "@repo/db";

export const readQuote = async (id: string) => {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
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
          firstName: true,
          lastName: true,
        },
      },
      Rfq: {
        select: {
          id: true,
          referenceNumber: true,
        },
      },
      FollowUp: {
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return quote;
};
