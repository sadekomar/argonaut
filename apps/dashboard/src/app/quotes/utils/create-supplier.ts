"use server";

import { CompanyType, prisma } from "@repo/db";

export const createSupplier = async (value: string) => {
  const supplier = await prisma.company.create({
    data: {
      name: value,
      type: CompanyType.SUPPLIER,
    },
  });

  return supplier;
};

export const createClient = async (value: string) => {
  const client = await prisma.company.create({
    data: {
      name: value,
      type: CompanyType.CLIENT,
    },
  });
  return client;
};

export const createProject = async (value: string) => {
  const project = await prisma.project.create({
    data: {
      name: value,
    },
  });
  return project;
};

export const createContactPerson = async (value: string) => {
  const contactPerson = await prisma.person.create({
    data: {
      name: value,
    },
  });
  return contactPerson;
};

export const createAuthor = async (value: string) => {
  const author = await prisma.person.create({
    data: {
      name: value,
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
