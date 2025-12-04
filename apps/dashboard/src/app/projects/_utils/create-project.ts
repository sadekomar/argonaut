"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@repo/db";

export interface CreateProjectForm {
  name: string;
  status?: ProjectStatus;
  companyId?: string;
}

export async function createProject(data: CreateProjectForm) {
  const { name, status, companyId } = data;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        ...(status && { status }),
        ...(companyId && { company: { connect: { id: companyId } } }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/");
    return project;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { errors: { name: ["Project with this name already exists"] } };
      }
    }
    throw e;
  }
}

