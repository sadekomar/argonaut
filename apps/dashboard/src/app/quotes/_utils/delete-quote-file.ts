"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function deleteQuoteFile(quoteId: string, objectKey: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { objectKeys: true },
  });

  if (!quote) {
    return {
      success: false as const,
      status: 404,
      errors: { quoteId: ["Quote not found"] },
    };
  }

  const remainingKeys = (quote.objectKeys ?? []).filter(
    (key) => key !== objectKey
  );

  if (remainingKeys.length === (quote.objectKeys ?? []).length) {
    return {
      success: false as const,
      status: 404,
      errors: { objectKey: ["File not associated with this quote"] },
    };
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: { objectKeys: remainingKeys },
  });

  revalidatePath("/");

  return { success: true as const };
}
