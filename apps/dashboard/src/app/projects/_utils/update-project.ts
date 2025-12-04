"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@repo/db";

export interface UpdateProjectForm {
  id: string;
  name?: string;
  status?: ProjectStatus | null;
  companyId?: string | null;
}

export async function updateProject(data: UpdateProjectForm) {
  const { id, name, status, companyId } = data;

  try {
    const updateData: Prisma.ProjectUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (companyId !== undefined) {
      if (companyId === null) {
        updateData.company = { disconnect: true };
      } else {
        updateData.company = { connect: { id: companyId } };
      }
    }

    await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { errors: { id: ["Project not found"] } };
      }
      if (e.code === "P2002") {
        return { errors: { name: ["Project with this name already exists"] } };
      }
    }
    throw e;
  }
}

