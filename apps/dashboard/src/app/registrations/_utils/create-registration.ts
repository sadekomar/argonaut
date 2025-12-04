"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { RegistrationStatus } from "@repo/db";

export interface AddRegistrationForm {
  companyId: string;
  registrationStatus: string;
  authorId: string;
  registrationFile?: string;
  notes?: string;
}

export async function createRegistration(data: AddRegistrationForm) {
  const { companyId, registrationStatus, authorId, registrationFile, notes } =
    data;

  try {
    await prisma.registration.create({
      data: {
        companyId: companyId,
        registrationStatus: registrationStatus as any,
        authorId: authorId,
        registrationFile: registrationFile || null,
        notes: notes || null,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors here
      if (e.code === "P2002") {
        return {
          errors: {
            companyId: ["Registration for this company already exists"],
          },
        };
      }
    }
    throw e;
  }
}
