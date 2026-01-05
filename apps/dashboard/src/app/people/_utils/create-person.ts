"use server";

import { Prisma, prisma } from "@repo/db";
import { PersonType } from "@repo/db";

export interface CreatePersonForm {
  id?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  type: PersonType;
}

export async function createPerson(data: CreatePersonForm) {
  const { id, firstName, lastName, title, email, phone, companyId, type } =
    data;

  console.log("createPerson", data);

  const finalName = `${firstName} ${lastName}`.trim();

  try {
    const person = await prisma.person.create({
      data: {
        id,
        firstName: firstName,
        lastName: lastName,
        title: title || null,
        email: email || null,
        phone: phone || null,
        companyId: companyId || null,
        type,
      },
    });

    return person;
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
export const createAuthor = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const author = await prisma.person.create({
    data: {
      id: id,
      name: name,
      type: PersonType.AUTHOR,
    },
  });

  return author;
};
export const createContactPerson = async ({
  id,
  name,
  companyId,
}: {
  id: string;
  name: string;
  companyId?: string;
}) => {
  const contactPerson = await prisma.person.create({
    data: {
      id: id,
      name: name,
      companyId: companyId ?? undefined,
      type: PersonType.CONTACT_PERSON,
    },
  });
  return contactPerson;
};
