"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { RegistrationStatus } from "@repo/db";

export interface UpdateRegistrationForm {
  id: string;
  companyId?: string;
  registrationStatus?: string;
  authorId?: string;
  registrationFile?: string;
  notes?: string;
}

export async function updateRegistration(data: UpdateRegistrationForm) {
  const {
    id,
    companyId,
    registrationStatus,
    authorId,
    registrationFile,
    notes,
  } = data;

  try {
    const updateData: Prisma.RegistrationUpdateInput = {};

    if (companyId !== undefined) {
      updateData.company = { connect: { id: companyId } };
    }

    if (registrationStatus !== undefined) {
      updateData.registrationStatus = registrationStatus as RegistrationStatus;
    }

    if (authorId !== undefined) {
      updateData.author = { connect: { id: authorId } };
    }

    if (registrationFile !== undefined) {
      updateData.registrationFile = registrationFile || null;
    }

    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    await prisma.registration.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Registration not found"] } };
      }
    }
    throw e;
  }
}
