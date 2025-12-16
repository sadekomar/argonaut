"use server";

import { prisma } from "@repo/db";
import type { Prisma, RegistrationStatus, CompanyType } from "@repo/db";

interface ReadRegistrationsParams {
  page?: number;
  perPage?: number;
  sort?: Array<{ id: string; desc: boolean }>;
  company?: string;
  companyType?: string[];
  registrationStatus?: string[];
  author?: string;
  createdAt?: string | [string, string];
}

export const readRegistrations = async (
  params: ReadRegistrationsParams = {}
) => {
  const {
    page = 1,
    perPage = 10,
    sort = [{ id: "createdAt", desc: true }],
    company,
    companyType,
    registrationStatus,
    author,
    createdAt,
  } = params;

  // Build where clause from filters
  const where: Prisma.RegistrationWhereInput = {};

  // Build company filter
  const companyFilter: Prisma.CompanyWhereInput = {};
  if (company) {
    companyFilter.name = {
      contains: company,
      mode: "insensitive",
    };
  }
  if (companyType && companyType.length > 0) {
    companyFilter.type = {
      in: companyType as CompanyType[],
    };
  }
  if (Object.keys(companyFilter).length > 0) {
    where.company = companyFilter;
  }

  if (registrationStatus && registrationStatus.length > 0) {
    where.registrationStatus = {
      in: registrationStatus as RegistrationStatus[],
    };
  }

  if (author) {
    where.author = {
      name: {
        contains: author,
        mode: "insensitive",
      },
    };
  }

  if (createdAt) {
    // Date can be a timestamp string or comma-separated timestamps for range
    if (typeof createdAt === "string") {
      const parts = createdAt.split(",").filter(Boolean);
      if (parts.length === 2) {
        // Date range
        where.createdAt = {
          gte: new Date(Number(parts[0])),
          lte: new Date(Number(parts[1])),
        };
      } else if (parts.length === 1) {
        // Single date (timestamp)
        const dateObj = new Date(Number(parts[0]));
        where.createdAt = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      }
    } else if (Array.isArray(createdAt) && createdAt.length === 2) {
      where.createdAt = {
        gte: new Date(Number(createdAt[0])),
        lte: new Date(Number(createdAt[1])),
      };
    }
  }

  // Build orderBy from sorting
  const orderBy: Prisma.RegistrationOrderByWithRelationInput[] = sort.map(
    (sortItem) => {
      const order = sortItem.desc ? "desc" : "asc";

      switch (sortItem.id) {
        case "company":
          return { company: { name: order } };
        case "companyType":
          return { company: { type: order } };
        case "registrationStatus":
          return { registrationStatus: order };
        case "author":
          return { author: { name: order } };
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
  const total = await prisma.registration.count({ where });

  // Fetch registrations with pagination
  const registrations = await prisma.registration.findMany({
    where,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }],
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return {
    data: registrations,
    total,
    pageCount: Math.ceil(total / perPage),
  };
};

export const readRegistrationsMetadata = async () => {
  const [
    totalRegistrations,
    verifiedRegistrations,
    underReviewRegistrations,
    onHoldRegistrations,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({
      where: {
        registrationStatus: "VERIFIED",
      },
    }),
    prisma.registration.count({
      where: {
        registrationStatus: "UNDER_REVIEW",
      },
    }),
    prisma.registration.count({
      where: {
        registrationStatus: "ON_HOLD",
      },
    }),
  ]);

  return {
    totalRegistrations,
    verifiedRegistrations,
    underReviewRegistrations,
    onHoldRegistrations,
  };
};
