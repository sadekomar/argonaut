import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readCompanies, readCompaniesMetadata } from "../_utils/read-companies";
import { updateCompany, UpdateCompanyForm } from "../_utils/update-company";
import { deleteCompany } from "../_utils/delete-company";
import { createCompany, CreateCompanyForm } from "../_utils/create-company";
import { toast } from "sonner";

export const useReadCompanies = (
  params?: Parameters<typeof readCompanies>[0]
) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => readCompanies(params),
  });
};

export const useReadCompaniesMetadata = () => {
  return useQuery({
    queryKey: ["companiesMetadata"],
    queryFn: readCompaniesMetadata,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCompany"],
    mutationFn: (data: CreateCompanyForm) => createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
      toast.success("Company created successfully", {
        description: "The company has been created successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to create company", {
        description: error.message || "The company could not be created.",
      });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCompany"],
    mutationFn: (data: UpdateCompanyForm) => updateCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
      toast.success("Company updated successfully", {
        description: "The company has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to update company", {
        description: error.message || "The company could not be updated.",
      });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCompany"],
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
      toast.success("Company deleted successfully", {
        description: "The company has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to delete company", {
        description: error.message || "The company could not be deleted.",
      });
    },
  });
};
