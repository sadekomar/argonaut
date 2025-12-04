"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Project not found"] } };
      }
    }
    throw e;
  }
}

