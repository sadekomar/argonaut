"use server";

import { CompanyType, PersonType, prisma } from "@repo/db";

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

export const createProject = async ({
  id,
  name,
  companyId,
}: {
  id: string;
  name: string;
  companyId?: string;
}) => {
  const project = await prisma.project.create({
    data: {
      id: id,
      name: name,
      companyId: companyId ?? undefined,
    },
  });
  return project;
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

export const readSuppliers = async () => {
  const suppliers = await prisma.company.findMany({
    where: {
      type: CompanyType.SUPPLIER,
    },
  });
  return suppliers;
};
