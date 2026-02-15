import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readQuotes, readQuotesMetadata } from "../_utils/read-quotes";
import { updateQuote } from "../_utils/update-quote";
import { deleteQuote } from "../_utils/delete-quote";
import { QuoteForm } from "./quote-form";
import { createQuote } from "../_utils/create-quote";
import { toast } from "sonner";
import { generateQuoteReferenceNumber } from "@/lib/utils";

export type ReadQuotesResponse = Awaited<ReturnType<typeof readQuotes>>;
export type ReadQuotesDataResponse = ReadQuotesResponse["data"];

export const useReadQuotes = (params?: Parameters<typeof readQuotes>[0]) => {
  return useQuery({
    queryKey: ["quotes", params],
    queryFn: () => readQuotes(params),
  });
};

export const useReadQuotesMetadata = (
  params?: Parameters<typeof readQuotesMetadata>[0]
) => {
  return useQuery({
    queryKey: ["quotesMetadata-client", params],
    queryFn: () => readQuotesMetadata(params),
  });
};

export const useCreateQuote = (params?: Parameters<typeof readQuotes>[0]) => {
  const queryClient = useQueryClient();

  const queryKey = params
    ? [
        "quotes",
        {
          ...params,
          // Include date and approximateSiteDeliveryDate explicitly, using null when undefined
          // to match the structure from useQueryStates (parseAsString returns null)
          date: params.date ?? null,
          approximateSiteDeliveryDate:
            params.approximateSiteDeliveryDate ?? null,
        },
      ]
    : ["quotes"];

  return useMutation({
    mutationFn: (data: QuoteForm) => createQuote(data),
    mutationKey: ["createQuote"],
    onMutate: async (data) => {
      try {
        await queryClient.cancelQueries({ queryKey });
        const previousQuotes = queryClient.getQueryData(queryKey);
        const transformedData: ReadQuotesDataResponse[number] = {
          id: crypto.randomUUID(),
          serialNumber: 0,
          referenceNumber:
            data.referenceNumber ?? generateQuoteReferenceNumber(0, data.date),
          date: new Date(data.date),
          currency: data.currency,
          rate: 0,
          value: Number(data.value),
          notes: data.notes ?? null,
          authorId: data.authorId,
          supplierId: data.supplierId ?? null,
          clientId: data.clientId,
          projectId: data.projectId,
          contactPersonId: data.contactPersonId,
          salesPersonId: data.salesPersonId ?? null,
          salesPerson: data.salesPersonId
            ? {
                id: data.salesPersonId ?? "",
                firstName: data.salesPersonName?.split(" ")[0] ?? "",
                lastName:
                  data.salesPersonName?.split(" ").slice(1).join(" ") ?? "",
              }
            : null,
          quoteOutcome: data.quoteOutcome ?? "PENDING",
          approximateSiteDeliveryDate: data.approximateSiteDeliveryDate
            ? new Date(data.approximateSiteDeliveryDate)
            : null,
          createdAt: new Date(),
          updatedAt: new Date(),
          objectKeys: data.objectKeys ?? [],
          author: {
            id: data.authorId,
            firstName: data.authorName?.split(" ")[0] ?? "",
            lastName: data.authorName?.split(" ").slice(1).join(" ") ?? "",
          },
          supplier: {
            id: data.supplierId,
            name: data.supplierName ?? "",
          },
          client: {
            id: data.clientId,
            name: data.clientName ?? "",
          },
          project: {
            id: data.projectId,
            name: data.projectName ?? "",
          },
          contactPerson: {
            id: data.contactPersonId,
            firstName: data.contactPersonName?.split(" ")[0] ?? "",
            lastName:
              data.contactPersonName?.split(" ").slice(1).join(" ") ?? "",
          },
        };

        queryClient.setQueryData(
          queryKey,
          (old: ReadQuotesResponse | undefined) =>
            old
              ? {
                  ...old,
                  data: [transformedData, ...old.data],
                  total: old.total + 1,
                }
              : { data: [transformedData], total: 1, pageCount: 1 }
        );

        return { previousQuotes, transformedData };
      } catch (e) {
        console.error("error creating quote", e);
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(queryKey, context.previousQuotes);
      }
      toast.error("Failed to create quote", {
        description: error.message || "The quote could not be created.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
      toast.success("Quote created successfully", {
        description: "The quote has been created successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
    },
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
      toast.success("Quote updated successfully", {
        description: "The quote has been updated successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
};

export const useDeleteQuote = (params?: Parameters<typeof readQuotes>[0]) => {
  const queryClient = useQueryClient();

  const queryKey = params
    ? [
        "quotes",
        {
          ...params,
          date: params.date ?? null,
          approximateSiteDeliveryDate:
            params.approximateSiteDeliveryDate ?? null,
        },
      ]
    : ["quotes"];

  return useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    mutationKey: ["deleteQuote"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["quotes"] });
      const previousQuotes = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: ReadQuotesResponse | undefined) => {
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
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
      toast.success("Quote deleted successfully", {
        description: "The quote has been deleted successfully.",
      });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousQuotes);
      toast.error(`Failed to delete quote: ${error.message}`, {
        description: "The quote has not been deleted.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
    },
  });
};
