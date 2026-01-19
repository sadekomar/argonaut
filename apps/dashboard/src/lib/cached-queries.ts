import { cache } from "react";
import { prisma } from "@repo/db";
import type { CompanyType, PersonType } from "@repo/db";

/**
 * Per-request deduplication with React.cache()
 *
 * React.cache() deduplicates expensive operations within a single request.
 * Multiple calls with the same arguments will only execute once.
 *
 * Note: React.cache() uses shallow equality (Object.is) to determine cache hits.
 * Avoid inline objects as arguments - use primitives or stable references.
 *
 * @see https://react.dev/reference/react/cache
 */

// Cache company lookups by type
export const getCompaniesByType = cache(async (type?: CompanyType) => {
  return prisma.company.findMany({
    where: type ? { type } : undefined,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });
});

// Cache all companies (commonly needed for dropdowns)
export const getAllCompanies = cache(async () => {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });
});

// Cache people lookups by type
export const getPeopleByType = cache(async (type?: PersonType) => {
  return prisma.person.findMany({
    where: type ? { type } : undefined,
    orderBy: { firstName: "asc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      type: true,
    },
  });
});

// Cache all people (commonly needed for dropdowns)
export const getAllPeople = cache(async () => {
  return prisma.person.findMany({
    orderBy: { firstName: "asc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      type: true,
    },
  });
});

// Cache all projects
export const getAllProjects = cache(async () => {
  return prisma.project.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
});

// Cache company by ID
export const getCompanyById = cache(async (id: string) => {
  return prisma.company.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      type: true,
      email: true,
      phone: true,
    },
  });
});

// Cache person by ID
export const getPersonById = cache(async (id: string) => {
  return prisma.person.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      type: true,
      email: true,
      phone: true,
      companyId: true,
    },
  });
});

// Cache project by ID
export const getProjectById = cache(async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
});

// Cache counts for dashboard metrics (deduplicated within request)
export const getDashboardCounts = cache(async () => {
  const [projects, companies, people, registrations, rfqs, quotes] =
    await Promise.all([
      prisma.project.count(),
      prisma.company.count(),
      prisma.person.count(),
      prisma.registration.count(),
      prisma.rfq.count(),
      prisma.quote.count(),
    ]);

  return {
    projects,
    companies,
    people,
    registrations,
    rfqs,
    quotes,
  };
});
