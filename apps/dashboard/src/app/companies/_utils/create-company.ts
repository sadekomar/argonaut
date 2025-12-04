"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { CompanyType } from "@repo/db";

export interface CreateCompanyForm {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  type: CompanyType;
}

export async function createCompany(data: CreateCompanyForm) {
  const { id, name, email, phone, type } = data;

  try {
    const company = await prisma.company.create({
      data: {
        id: id,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        type: type,
      },
    });

    return company;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors here
      if (e.code === "P2002") {
        throw new Error(e.message);
      }
    }
    throw e;
  }
}
export const createClient = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const client = await prisma.company.create({
    data: {
      id: id,
      name: name,
      type: CompanyType.CLIENT,
    },
  });
  return client;
};
export const createSupplier = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const supplier = await prisma.company.create({
    data: {
      id: id,
      name: name,
      type: CompanyType.SUPPLIER,
    },
  });

  return supplier;
};
