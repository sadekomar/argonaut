"use server";

import { CompanyType, PersonType } from "@repo/db";
import { prisma } from "@repo/db";

export const readSuppliers = async () => {
  const suppliers = await prisma.company.findMany({
    where: {
      type: CompanyType.SUPPLIER,
    },
  });

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));

  return supplierOptions;
};

export const readClients = async () => {
  const suppliers = await prisma.company.findMany({
    where: {
      type: CompanyType.CLIENT,
    },
  });
  console.log("suppliers", suppliers);

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));

  return supplierOptions;
};

export const readContactPersons = async () => {
  const contactPersons = await prisma.person.findMany({
    where: {
      type: PersonType.CONTACT_PERSON,
    },
  });

  const contactPersonOptions = contactPersons.map((contactPerson) => ({
    value: contactPerson.id,
    label: contactPerson.name,
  }));

  return contactPersonOptions;
};

export const readAuthors = async () => {
  const authors = await prisma.person.findMany({
    where: {
      type: PersonType.AUTHOR,
    },
  });

  const authorOptions = authors.map((author) => ({
    value: author.id,
    label: author.name,
  }));

  return authorOptions;
};

export const readProjects = async () => {
  const projects = await prisma.project.findMany();

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  return projectOptions;
};
