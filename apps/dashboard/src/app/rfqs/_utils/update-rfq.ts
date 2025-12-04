"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { Currency } from "@repo/db";

export interface UpdateRfqForm {
  id: string;
  date?: string;
  currency?: string;
  value?: string;
  notes?: string;
  authorId?: string;
  supplierId?: string;
  clientId?: string;
  projectId?: string;
  rfqReceivedAt?: string;
}

export async function updateRfq(data: UpdateRfqForm) {
  const {
    id,
    value,
    date,
    currency,
    notes,
    authorId,
    clientId,
    projectId,
    supplierId,
    rfqReceivedAt,
  } = data;

  try {
    const updateData: Prisma.RfqUpdateInput = {};

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    if (currency !== undefined) {
      updateData.currency = currency as Currency;
      // If currency changes, we might want to update the rate
      // For now, we'll keep the existing rate
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
      updateData.supplier = { connect: { id: supplierId } };
    }

    if (rfqReceivedAt !== undefined) {
      updateData.rfqReceivedAt = rfqReceivedAt ? new Date(rfqReceivedAt) : null;
    }

    await prisma.rfq.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["RFQ not found"] } };
      }
    }
    throw e;
  }
}
