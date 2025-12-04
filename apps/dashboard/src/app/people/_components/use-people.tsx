import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readPeople, readPeopleMetadata } from "../_utils/read-people";
import { updatePerson, UpdatePersonForm } from "../_utils/update-person";
import { deletePerson } from "../_utils/delete-person";

export type GetPeopleResponse = Awaited<ReturnType<typeof readPeople>>;
export type GetPeopleDataResponse = GetPeopleResponse["data"];

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

export const useGetPeople = (params?: Parameters<typeof readPeople>[0]) => {
  return useQuery({
    queryKey: ["people", params],
    queryFn: () => readPeople(params),
  });
};

export const useGetPeopleMetadata = () => {
  return useQuery({
    queryKey: ["peopleMetadata"],
    queryFn: readPeopleMetadata,
  });
};

export const useEditPerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePersonForm) => updatePerson(data),
    mutationKey: ["editPerson"],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["people"] });
      const previousPeople = queryClient.getQueryData(["people"]);

      // Optimistically update the person in the list
      queryClient.setQueryData(
        ["people"],
        (old: GetPeopleResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((person) => {
              if (person.id === data.id) {
                return {
                  ...person,
                  ...(data.name && { name: data.name }),
                  ...(data.email !== undefined && {
                    email: data.email || null,
                  }),
                  ...(data.phone !== undefined && {
                    phone: data.phone || null,
                  }),
                  ...(data.companyId !== undefined && {
                    companyId: data.companyId || null,
                    company: data.companyId
                      ? { ...person.company, id: data.companyId }
                      : null,
                  }),
                  ...(data.type && { type: data.type }),
                  updatedAt: new Date(),
                };
              }
              return person;
            }),
          };
        }
      );

      return { previousPeople };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
      toast.success("Person updated successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["people"], context?.previousPeople);
      toast.error(`Failed to update person: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePerson(id),
    mutationKey: ["deletePerson"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["people"] });
      const previousPeople = queryClient.getQueryData(["people"]);

      queryClient.setQueryData(
        ["people"],
        (old: GetPeopleResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((person) => person.id !== id),
            total: Math.max(0, old.total - 1),
            pageCount: Math.ceil(
              Math.max(0, old.total - 1) / (old.data.length || 1)
            ),
          };
        }
      );

      return { previousPeople };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
      toast.success("Person deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["people"], context?.previousPeople);
      toast.error(`Failed to delete person: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
    },
  });
};
