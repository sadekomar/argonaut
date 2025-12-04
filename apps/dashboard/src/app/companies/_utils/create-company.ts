"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { CompanyType } from "@repo/db";

export interface CreateCompanyForm {
  name: string;
  email?: string;
  phone?: string;
  type: CompanyType;
}

export async function createCompany(data: CreateCompanyForm) {
  const { name, email, phone, type } = data;

  try {
    await prisma.company.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        type: type,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors here
      if (e.code === "P2002") {
        return { errors: { name: ["Company with this name already exists"] } };
      }
    }
    throw e;
  }
}
