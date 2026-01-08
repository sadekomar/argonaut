"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export interface CreateFollowUpForm {
  quoteId: string;
  authorId: string;
  notes?: string;
}

export async function createFollowUp(data: CreateFollowUpForm) {
  const { quoteId, authorId, notes } = data;

  try {
    const followUp = await prisma.followUp.create({
      data: {
        quoteId,
        authorId,
        notes: notes || null,
      },
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
    });

    revalidatePath("/");
    return followUp;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2003") {
        return {
          errors: {
            quoteId: ["Quote not found"],
            authorId: ["Author not found"],
          },
        };
      }
    }
    throw e;
  }
}
