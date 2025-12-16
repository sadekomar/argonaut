"use server";

import { prisma, Prisma, CompanyType } from "@repo/db";

interface ReadCompaniesParams {
  page?: number;
  perPage?: number;
  sort?: Array<{ id: string; desc: boolean }>;
  name?: string;
  email?: string;
  phone?: string;
  type?: string[];
}

export const readCompanies = async (params: ReadCompaniesParams = {}) => {
  const {
    page = 1,
    perPage,
    sort = [{ id: "createdAt", desc: true }],
    name,
    email,
    phone,
    type,
  } = params;

  // Build where clause from filters
  const where: Prisma.CompanyWhereInput = {};

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (email) {
    where.email = {
      contains: email,
      mode: "insensitive",
    };
  }

  if (phone) {
    where.phone = {
      contains: phone,
      mode: "insensitive",
    };
  }

  if (type && type.length > 0) {
    where.type = {
      in: type as CompanyType[],
    };
  }

  // Build orderBy from sorting
  const orderBy: Prisma.CompanyOrderByWithRelationInput[] = sort.map(
    (sortItem) => {
      const order = sortItem.desc ? "desc" : "asc";

      switch (sortItem.id) {
        case "name":
          return { name: order };
        case "email":
          return { email: order };
        case "phone":
          return { phone: order };
        case "type":
          return { type: order };
        case "createdAt":
          return { createdAt: order };
        case "updatedAt":
          return { updatedAt: order };
        default:
          return { createdAt: "desc" };
      }
    }
  );

  // Get total count for pagination
  const total = await prisma.company.count({ where });

  // Fetch companies with pagination
  const companies = await prisma.company.findMany({
    where,
    orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
    ...(perPage ? { take: perPage, skip: (page - 1) * perPage } : {}),
  });

  return {
    data: companies,
    total,
    pageCount: Math.ceil(total / (perPage ?? 40)),
  };
};

export const readCompaniesMetadata = async () => {
  const [totalCompanies, suppliers, clients, contractors, consultants] =
    await Promise.all([
      prisma.company.count(),
      prisma.company.count({
        where: {
          type: CompanyType.SUPPLIER,
        },
      }),
      prisma.company.count({
        where: {
          type: CompanyType.CLIENT,
        },
      }),
      prisma.company.count({
        where: {
          type: CompanyType.CONTRACTOR,
        },
      }),
      prisma.company.count({
        where: {
          type: CompanyType.CONSULTANT,
        },
      }),
    ]);

  return {
    totalCompanies,
    suppliers,
    clients,
    contractors,
    consultants,
  };
};
export const readSuppliers = async () => {
  const suppliers = await prisma.company.findMany({
    where: {
      type: CompanyType.SUPPLIER,
    },
  });
  return suppliers;
};
