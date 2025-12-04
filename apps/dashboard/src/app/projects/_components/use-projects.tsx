import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  readProjects,
  readProjectsMetadata,
} from "../_utils/read-projects";
import { updateProject, UpdateProjectForm } from "../_utils/update-project";
import { deleteProject } from "../_utils/delete-project";
import { createProject, CreateProjectForm } from "../_utils/create-project";

export type GetProjectsResponse = Awaited<ReturnType<typeof readProjects>>;
export type GetProjectsDataResponse = GetProjectsResponse["data"];

// Utility functions
function handleAbort<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    return fn(...args);
  };
}

// Simple toast replacement
const toast = {
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
};

export const useGetProjects = (
  params?: Parameters<typeof readProjects>[0]
) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => readProjects(params),
  });
};

export const useGetProjectsMetadata = () => {
  return useQuery({
    queryKey: ["projectsMetadata"],
    queryFn: readProjectsMetadata,
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: CreateProjectForm) => createProject(data),
    mutationKey: ["createProject"],
  });
};

export const useEditProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectForm) => updateProject(data),
    mutationKey: ["editProject"],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData(["projects"]);

      // Optimistically update the project in the list
      queryClient.setQueryData(
        ["projects"],
        (old: GetProjectsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((project) => {
              if (project.id === data.id) {
                return {
                  ...project,
                  ...(data.name && { name: data.name }),
                  ...(data.status !== undefined && { status: data.status }),
                  ...(data.companyId !== undefined && {
                    companyId: data.companyId,
                    company: data.companyId
                      ? { ...project.company, id: data.companyId }
                      : null,
                  }),
                  updatedAt: new Date(),
                };
              }
              return project;
            }),
          };
        }
      );

      return { previousProjects };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectsMetadata"] });
      toast.success("Project updated successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
      toast.error(`Failed to update project: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    mutationKey: ["deleteProject"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(
        ["projects"],
        (old: GetProjectsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((project) => project.id !== id),
            total: Math.max(0, old.total - 1),
            pageCount: Math.ceil(
              Math.max(0, old.total - 1) / (old.data.length || 1)
            ),
          };
        }
      );

      return { previousProjects };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectsMetadata"] });
      toast.success("Project deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
      toast.error(`Failed to delete project: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectsMetadata"] });
    },
  });
};

