"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { PersonType } from "@repo/db";

export interface UpdatePersonForm {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  type?: PersonType;
}

export async function updatePerson(data: UpdatePersonForm) {
  const { id, name, email, phone, companyId, type } = data;

  try {
    const updateData: Prisma.PersonUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email || null;
    }

    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (companyId !== undefined) {
      updateData.company = companyId
        ? { connect: { id: companyId } }
        : { disconnect: true };
    }

    if (type !== undefined) {
      updateData.type = type;
    }

    await prisma.person.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Person not found"] } };
      }
    }
    throw e;
  }
}
