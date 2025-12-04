"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export interface UpdateFollowUpForm {
  id: string;
  quoteId?: string;
  authorId?: string;
  notes?: string | null;
}

export async function updateFollowUp(data: UpdateFollowUpForm) {
  const { id, quoteId, authorId, notes } = data;

  try {
    const updateData: Prisma.FollowUpUpdateInput = {};

    if (quoteId !== undefined) {
      updateData.quote = { connect: { id: quoteId } };
    }

    if (authorId !== undefined) {
      updateData.author = { connect: { id: authorId } };
    }

    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    await prisma.followUp.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Follow-up not found"] } };
      }
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

