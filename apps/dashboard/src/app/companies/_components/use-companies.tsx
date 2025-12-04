import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readCompanies, readCompaniesMetadata } from "../_utils/read-companies";
import { updateCompany, UpdateCompanyForm } from "../_utils/update-company";
import { deleteCompany } from "../_utils/delete-company";

export type GetCompaniesResponse = Awaited<ReturnType<typeof readCompanies>>;
export type GetCompaniesDataResponse = GetCompaniesResponse["data"];

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

export const useGetCompanies = (
  params?: Parameters<typeof readCompanies>[0]
) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => readCompanies(params),
  });
};

export const useGetCompaniesMetadata = () => {
  return useQuery({
    queryKey: ["companiesMetadata"],
    queryFn: readCompaniesMetadata,
  });
};

export const useEditCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyForm) => updateCompany(data),
    mutationKey: ["editCompany"],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });
      const previousCompanies = queryClient.getQueryData(["companies"]);

      // Optimistically update the company in the list
      queryClient.setQueryData(
        ["companies"],
        (old: GetCompaniesResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((company) => {
              if (company.id === data.id) {
                return {
                  ...company,
                  ...(data.name && { name: data.name }),
                  ...(data.email !== undefined && {
                    email: data.email || null,
                  }),
                  ...(data.phone !== undefined && {
                    phone: data.phone || null,
                  }),
                  ...(data.type && { type: data.type }),
                  updatedAt: new Date(),
                };
              }
              return company;
            }),
          };
        }
      );

      return { previousCompanies };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
      toast.success("Company updated successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["companies"], context?.previousCompanies);
      toast.error(`Failed to update company: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    mutationKey: ["deleteCompany"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });
      const previousCompanies = queryClient.getQueryData(["companies"]);

      queryClient.setQueryData(
        ["companies"],
        (old: GetCompaniesResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((company) => company.id !== id),
            total: Math.max(0, old.total - 1),
            pageCount: Math.ceil(
              Math.max(0, old.total - 1) / (old.data.length || 1)
            ),
          };
        }
      );

      return { previousCompanies };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
      toast.success("Company deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["companies"], context?.previousCompanies);
      toast.error(`Failed to delete company: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
    },
  });
};
