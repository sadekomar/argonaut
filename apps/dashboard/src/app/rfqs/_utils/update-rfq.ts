"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { Currency, RfqStatus } from "@repo/db";
import { RfqForm } from "../_components/rfq-form";

export async function updateRfq(id: string, data: Partial<RfqForm>) {
  const {
    referenceNumber,
    quoteId,
    rfqStatus,
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
    const updateData: Prisma.RfqUpdateInput = {
      ...(referenceNumber && { referenceNumber }),
      ...(rfqStatus && { rfqStatus }),
      ...(quoteId && { quote: { connect: { id: quoteId } } }),
      ...(date && { date: date ? new Date(date) : null }),
      ...(currency && { currency }),
      ...(value && { value: Number(value) }),
      ...(notes && { notes: notes || null }),
      ...(authorId && { author: { connect: { id: authorId } } }),
      ...(clientId && { client: { connect: { id: clientId } } }),
      ...(projectId && {
        project: { connect: { id: projectId } },
      }),
      ...(supplierId && {
        supplier: { connect: { id: supplierId } },
      }),
      ...(rfqReceivedAt && {
        rfqReceivedAt: rfqReceivedAt ? new Date(rfqReceivedAt) : null,
      }),
    };

    console.log("updateData", updateData);

    try {
      await prisma.rfq.update({
        where: { id },
        data: updateData,
      });
    } catch (e) {
      console.error("error updating rfq", e);
    }

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
