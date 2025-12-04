"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function deleteFollowUp(id: string) {
  try {
    await prisma.followUp.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Follow-up not found"] } };
      }
    }
    throw e;
  }
}

