import { useMutation, useQuery } from "@tanstack/react-query";
import { readCompanies, readCompaniesMetadata } from "../_utils/read-companies";
import { updateCompany, UpdateCompanyForm } from "../_utils/update-company";
import { deleteCompany } from "../_utils/delete-company";
import { createCompany, CreateCompanyForm } from "../_utils/create-company";

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
  return useMutation({
    mutationKey: ["createCompany"],
    mutationFn: (data: CreateCompanyForm) => createCompany(data),
  });
};

export const useUpdateCompany = () => {
  return useMutation({
    mutationKey: ["updateCompany"],
    mutationFn: (data: UpdateCompanyForm) => updateCompany(data),
  });
};

export const useDeleteCompany = () => {
  return useMutation({
    mutationKey: ["deleteCompany"],
    mutationFn: (id: string) => deleteCompany(id),
  });
};
