"use server";

import { prisma } from "@repo/db";
import type { ProjectStatus, Prisma } from "@repo/db";

interface ReadProjectsParams {
  page?: number;
  perPage?: number;
  sort?: Array<{ id: string; desc: boolean }>;
  name?: string;
  status?: string[];
  company?: string;
}

export const readProjects = async (params: ReadProjectsParams = {}) => {
  const {
    page = 1,
    perPage = 10,
    sort = [{ id: "createdAt", desc: true }],
    name,
    status,
    company,
  } = params;

  // Build where clause from filters
  const where: Prisma.ProjectWhereInput = {};

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (status && status.length > 0) {
    where.status = {
      in: status as ProjectStatus[],
    };
  }

  if (company) {
    where.company = {
      name: {
        contains: company,
        mode: "insensitive",
      },
    };
  }

  // Build orderBy from sorting
  const orderBy: Prisma.ProjectOrderByWithRelationInput[] = sort.map(
    (sortItem) => {
      const order = sortItem.desc ? "desc" : "asc";

      switch (sortItem.id) {
        case "name":
          return { name: order };
        case "status":
          return { status: order };
        case "company":
          return { company: { name: order } };
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
  const total = await prisma.project.count({ where });

  // Fetch projects with pagination
  const projects = await prisma.project.findMany({
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
    data: projects,
    total,
    pageCount: Math.ceil(total / perPage),
  };
};

export const readProjectsMetadata = async () => {
  const [totalProjects, inHandProjects, tenderProjects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({
      where: {
        status: "IN_HAND",
      },
    }),
    prisma.project.count({
      where: {
        status: "TENDER",
      },
    }),
  ]);

  return {
    totalProjects,
    inHandProjects,
    tenderProjects,
  };
};
