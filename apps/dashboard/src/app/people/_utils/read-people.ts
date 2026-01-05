"use server";

import { prisma } from "@repo/db";
import type { PersonType, Prisma } from "@repo/db";

interface ReadPeopleParams {
  page?: number;
  perPage?: number;
  sort?: Array<{ id: string; desc: boolean }>;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string[];
  type?: string[];
}

export const readPeople = async (params: ReadPeopleParams = {}) => {
  const {
    page = 1,
    perPage = 10,
    sort = [{ id: "createdAt", desc: true }],
    firstName,
    lastName,
    email,
    phone,
    company,
    type,
  } = params;

  // Build where clause from filters
  const where: Prisma.PersonWhereInput = {};

  if (firstName) {
    where.firstName = {
      contains: firstName,
      mode: "insensitive",
    };
  }

  if (lastName) {
    where.lastName = {
      contains: lastName,
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

  if (company && company.length > 0) {
    where.companyId = {
      in: company,
    };
  }

  if (type && type.length > 0) {
    where.type = {
      in: type as PersonType[],
    };
  }

  // Build orderBy from sorting
  const orderBy: Prisma.PersonOrderByWithRelationInput[] = sort.map(
    (sortItem) => {
      const order = sortItem.desc ? "desc" : "asc";

      switch (sortItem.id) {
        case "firstName":
          return { firstName: order };
        case "lastName":
          return { lastName: order };
        case "email":
          return { email: order };
        case "phone":
          return { phone: order };
        case "company":
          return { company: { name: order } };
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
  const total = await prisma.person.count({ where });

  // Fetch people with pagination
  const people = await prisma.person.findMany({
    where,
    include: {
      company: {
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
    data: people,
    total,
    pageCount: Math.ceil(total / perPage),
  };
};

export const readPeopleMetadata = async () => {
  const [totalPeople, authors, contactPersons, internal] = await Promise.all([
    prisma.person.count(),
    prisma.person.count({
      where: {
        type: "AUTHOR",
      },
    }),
    prisma.person.count({
      where: {
        type: "CONTACT_PERSON",
      },
    }),
    prisma.person.count({
      where: {
        type: "INTERNAL",
      },
    }),
  ]);

  return {
    totalPeople,
    authors,
    contactPersons,
    internal,
  };
};
