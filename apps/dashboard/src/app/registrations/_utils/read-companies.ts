"use server";

import { prisma } from "@repo/db";

export const readAllCompanies = async () => {
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  return companyOptions;
};

