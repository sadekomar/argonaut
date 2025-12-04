"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { PersonType } from "@repo/db";

export interface CreatePersonForm {
  name: string;
  email?: string;
  phone?: string;
  companyId?: string;
  type: PersonType;
}

export async function createPerson(data: CreatePersonForm) {
  const { name, email, phone, companyId, type } = data;

  try {
    await prisma.person.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        companyId: companyId || null,
        type,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors here
      if (e.code === "P2002") {
        return { errors: { name: ["Person with this name already exists"] } };
      }
    }
    throw e;
  }
}
