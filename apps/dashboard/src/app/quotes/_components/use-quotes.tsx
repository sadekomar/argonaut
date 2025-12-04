import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readQuotes, readQuotesMetadata } from "../_utils/read-quotes";
import { updateQuote } from "../_utils/update-quote";
import { deleteQuote } from "../_utils/delete-quote";
import { QuoteForm } from "./quote-form";
import { createQuote } from "../_utils/create-quote";

export type GetQuotesResponse = Awaited<ReturnType<typeof readQuotes>>;
export type GetQuotesDataResponse = GetQuotesResponse["data"];

const toast = {
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
};

export const useGetQuotes = (params?: Parameters<typeof readQuotes>[0]) => {
  return useQuery({
    queryKey: ["quotes", params],
    queryFn: () => readQuotes(params),
  });
};

export const useGetQuotesMetadata = () => {
  return useQuery({
    queryKey: ["quotesMetadata"],
    queryFn: readQuotesMetadata,
  });
};

export const useCreateQuote = () => {
  return useMutation({
    mutationFn: (data: QuoteForm) => createQuote(data),
    mutationKey: ["createQuote"],
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuoteForm> }) =>
      updateQuote(id, data),
    mutationKey: ["editQuote"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
      toast.success("Quote updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
};

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    mutationKey: ["deleteQuote"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["quotes"] });
      const previousQuotes = queryClient.getQueryData(["quotes"]);

      queryClient.setQueryData(
        ["quotes"],
        (old: GetQuotesResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((quote) => quote.id !== id),
            total: Math.max(0, old.total - 1),
            pageCount: Math.ceil(
              Math.max(0, old.total - 1) / (old.data.length || 1)
            ),
          };
        }
      );

      return { previousQuotes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
      toast.success("Quote deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["quotes"], context?.previousQuotes);
      toast.error(`Failed to delete quote: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
    },
  });
};
