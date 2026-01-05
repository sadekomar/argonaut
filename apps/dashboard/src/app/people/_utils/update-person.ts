"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { PersonType } from "@repo/db";

export interface UpdatePersonForm {
  id: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  type?: PersonType;
}

export async function updatePerson(data: UpdatePersonForm) {
  const { id, firstName, lastName, title, email, phone, companyId, type } =
    data;

  try {
    const updateData: Prisma.PersonUpdateInput = {};

    if (firstName !== undefined) {
      updateData.firstName = firstName;
    }
    if (lastName !== undefined) {
      updateData.lastName = lastName;
    }

    if (title !== undefined) {
      updateData.title = title || null;
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
