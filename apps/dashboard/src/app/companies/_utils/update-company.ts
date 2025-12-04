"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { CompanyType } from "@repo/db";

export interface UpdateCompanyForm {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: CompanyType;
}

export async function updateCompany(data: UpdateCompanyForm) {
  const { id, name, email, phone, type } = data;

  try {
    const updateData: Prisma.CompanyUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email?.trim() || null;
    }

    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null;
    }

    if (type !== undefined) {
      updateData.type = type;
    }

    await prisma.company.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Company not found"] } };
      }
      if (e.code === "P2002") {
        return { errors: { name: ["Company with this name already exists"] } };
      }
    }
    throw e;
  }
}
