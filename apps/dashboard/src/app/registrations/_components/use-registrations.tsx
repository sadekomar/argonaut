import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  readRegistrations,
  readRegistrationsMetadata,
} from "../_utils/read-registrations";
import {
  updateRegistration,
  UpdateRegistrationForm,
} from "../_utils/update-registration";
import { deleteRegistration } from "../_utils/delete-registration";

export type GetRegistrationsResponse = Awaited<
  ReturnType<typeof readRegistrations>
>;
export type GetRegistrationsDataResponse = GetRegistrationsResponse["data"];

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

export const useGetRegistrations = (
  params?: Parameters<typeof readRegistrations>[0]
) => {
  return useQuery({
    queryKey: ["registrations", params],
    queryFn: () => readRegistrations(params),
  });
};

export const useGetRegistrationsMetadata = () => {
  return useQuery({
    queryKey: ["registrationsMetadata"],
    queryFn: readRegistrationsMetadata,
  });
};

export const useEditRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRegistrationForm) => updateRegistration(data),
    mutationKey: ["editRegistration"],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["registrations"] });
      const previousRegistrations = queryClient.getQueryData(["registrations"]);

      // Optimistically update the registration in the list
      queryClient.setQueryData(
        ["registrations"],
        (old: GetRegistrationsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((registration) => {
              if (registration.id === data.id) {
                return {
                  ...registration,
                  ...(data.companyId && {
                    companyId: data.companyId,
                    company: { ...registration.company, id: data.companyId },
                  }),
                  ...(data.registrationStatus && {
                    registrationStatus: data.registrationStatus as any,
                  }),
                  ...(data.authorId && {
                    authorId: data.authorId,
                    author: { ...registration.author, id: data.authorId },
                  }),
                  ...(data.registrationFile !== undefined && {
                    registrationFile: data.registrationFile || null,
                  }),
                  ...(data.notes !== undefined && {
                    notes: data.notes || null,
                  }),
                  updatedAt: new Date(),
                };
              }
              return registration;
            }),
          };
        }
      );

      return { previousRegistrations };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      toast.success("Registration updated successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["registrations"],
        context?.previousRegistrations
      );
      toast.error(`Failed to update registration: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
};

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRegistration(id),
    mutationKey: ["deleteRegistration"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["registrations"] });
      const previousRegistrations = queryClient.getQueryData(["registrations"]);

      queryClient.setQueryData(
        ["registrations"],
        (old: GetRegistrationsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((registration) => registration.id !== id),
            total: Math.max(0, old.total - 1),
            pageCount: Math.ceil(
              Math.max(0, old.total - 1) / (old.data.length || 1)
            ),
          };
        }
      );

      return { previousRegistrations };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      toast.success("Registration deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["registrations"],
        context?.previousRegistrations
      );
      toast.error(`Failed to delete registration: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
    },
  });
};
