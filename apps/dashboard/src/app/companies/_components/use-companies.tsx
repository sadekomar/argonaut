import { useQuery } from "@tanstack/react-query";
import { readCompanies } from "../_utils/read-companies";

export const useReadCompanies = (
  params?: Parameters<typeof readCompanies>[0]
) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => readCompanies(params),
  });
};
