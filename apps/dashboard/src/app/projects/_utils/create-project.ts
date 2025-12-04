"use server";

import { prisma } from "@repo/db";
import type { ProjectStatus } from "@repo/db";

export type CreateProjectProps = {
  id?: string;
  name: string;
  status?: ProjectStatus;
  companyId?: string;
};

export const createProject = async ({
  id,
  name,
  status,
  companyId,
}: CreateProjectProps) => {
  const project = await prisma.project.create({
    data: {
      id: id,
      name: name,
      status: status ?? undefined,
      companyId: companyId ?? undefined,
    },
  });
  return project;
};
