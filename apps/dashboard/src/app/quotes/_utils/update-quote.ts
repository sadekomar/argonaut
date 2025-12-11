"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { Currency, QuoteOutcome } from "@repo/db";
import { QuoteForm } from "../_components/quote-form";

export async function updateQuote(id: string, data: Partial<QuoteForm>) {
  const {
    referenceNumber,
    value,
    date,
    currency,
    notes,
    authorId,
    clientId,
    projectId,
    supplierId,
    contactPersonId,
    quoteOutcome,
    approximateSiteDeliveryDate,
    objectKeys,
  } = data;

  try {
    // If objectKeys is provided, fetch existing quote to append to existing objectKeys
    let mergedObjectKeys: string[] | undefined;
    if (objectKeys !== undefined) {
      const existingQuote = await prisma.quote.findUnique({
        where: { id },
        select: { objectKeys: true },
      });
      const existingObjectKeys = existingQuote?.objectKeys || [];
      // Merge arrays and remove duplicates
      mergedObjectKeys = Array.from(
        new Set([...existingObjectKeys, ...objectKeys])
      );
    }

    const updateData: Prisma.QuoteUpdateInput = {
      ...(referenceNumber !== undefined && { referenceNumber }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(currency !== undefined && { currency: currency as Currency }),
      ...(value !== undefined && { value: Number(value) }),
      ...(notes !== undefined && { notes: notes || null }),
      ...(authorId !== undefined && { author: { connect: { id: authorId } } }),
      ...(clientId !== undefined && { client: { connect: { id: clientId } } }),
      ...(projectId !== undefined && {
        project: { connect: { id: projectId } },
      }),
      ...(supplierId !== undefined && {
        supplier: supplierId
          ? { connect: { id: supplierId } }
          : { disconnect: true },
      }),
      ...(contactPersonId !== undefined && {
        contactPerson: { connect: { id: contactPersonId } },
      }),
      ...(quoteOutcome !== undefined && {
        quoteOutcome: quoteOutcome as QuoteOutcome,
      }),
      ...(approximateSiteDeliveryDate !== undefined && {
        approximateSiteDeliveryDate: approximateSiteDeliveryDate
          ? new Date(approximateSiteDeliveryDate)
          : null,
      }),
      ...(mergedObjectKeys !== undefined && { objectKeys: mergedObjectKeys }),
    };

    await prisma.quote.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Quote not found"] } };
      }
    }
    throw e;
  }
}
