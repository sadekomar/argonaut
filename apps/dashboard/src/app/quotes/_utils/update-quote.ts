"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { Currency, QuoteOutcome } from "@repo/db";
import { QuoteForm } from "../_components/quote-form";

export async function updateQuote(id: string, data: Partial<QuoteForm>) {
  const {
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
    const updateData: Prisma.QuoteUpdateInput = {};

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    if (currency !== undefined) {
      updateData.currency = currency as Currency;
    }

    if (value !== undefined) {
      updateData.value = Number(value);
    }

    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    if (authorId !== undefined) {
      updateData.author = { connect: { id: authorId } };
    }

    if (clientId !== undefined) {
      updateData.client = { connect: { id: clientId } };
    }

    if (projectId !== undefined) {
      updateData.project = { connect: { id: projectId } };
    }

    if (supplierId !== undefined) {
      updateData.supplier = supplierId
        ? { connect: { id: supplierId } }
        : { disconnect: true };
    }

    if (contactPersonId !== undefined) {
      updateData.contactPerson = { connect: { id: contactPersonId } };
    }

    if (quoteOutcome !== undefined) {
      updateData.quoteOutcome = quoteOutcome as QuoteOutcome;
    }

    if (approximateSiteDeliveryDate !== undefined) {
      updateData.approximateSiteDeliveryDate = approximateSiteDeliveryDate
        ? new Date(approximateSiteDeliveryDate)
        : null;
    }

    if (objectKeys !== undefined) {
      updateData.objectKeys = objectKeys;
    }

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
