import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readRfq, readRfqs, readRfqsMetadata } from "../_utils/read-rfqs";
import { createRfq, CreateRfqForm } from "../_utils/create-rfq";
import { deleteRfq } from "../_utils/delete-rfq";
import { updateRfq, UpdateRfqForm } from "../_utils/update-rfq";

// Utility functions
function generateTemporaryId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

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

type Currency = "EGP" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

export interface Rfq {
  id: string;
  serialNumber: number;
  referenceNumber: string;
  date: Date | string;
  currency: Currency;
  rate: number;
  value: number;
  notes: string | null;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  supplierId: string;
  supplier: {
    id: string;
    name: string;
  };
  clientId: string;
  client: {
    id: string;
    name: string;
  };
  projectId: string;
  project: {
    id: string;
    name: string;
  };
  rfqReceivedAt: Date | string | null;
  quoteId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type GetRfqsResponse = Awaited<ReturnType<typeof readRfqs>>;
export type GetRfqsDataResponse = GetRfqsResponse["data"];

export const useGetRfq = (id: string) => {
  return useQuery({
    queryKey: ["rfq", id],
    queryFn: handleAbort(() => readRfq(id)),
    enabled: !!id,
  });
};

export const useGetRfqs = (params?: Parameters<typeof readRfqs>[0]) => {
  return useQuery({
    queryKey: ["rfqs", params],
    queryFn: handleAbort(() => readRfqs(params)),
  });
};

export const useGetRfqsMetadata = () => {
  return useQuery({
    queryKey: ["rfqsMetadata"],
    queryFn: handleAbort(readRfqsMetadata),
  });
};

export const useRevalidateRfqs = () => {
  const queryClient = useQueryClient();

  return {
    refetchRfqs: () => queryClient.invalidateQueries({ queryKey: ["rfqs"] }),
    refetchRfqsMetadata: () =>
      queryClient.invalidateQueries({ queryKey: ["rfqsMetadata"] }),
  };
};

export const useAddRfq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRfqForm) => createRfq(data),
    mutationKey: ["addRfq"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfqsMetadata"] });
      toast.success("RFQ created successfully");
    },
    onError: (error, variables, context) => {
      toast.error(`Failed to create RFQ: ${error.message}`);
    },
  });
};

export const useEditRfq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRfqForm) => updateRfq(data),
    mutationKey: ["editRfq"],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["rfqs"] });
      await queryClient.cancelQueries({ queryKey: ["rfq", data.id] });
      const previousRfqs = queryClient.getQueryData(["rfqs"]);
      const previousRfq = queryClient.getQueryData(["rfq", data.id]);

      // Optimistically update the RFQ in the list
      queryClient.setQueryData(["rfqs"], (old: GetRfqsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((rfq) => {
            if (rfq.id === data.id) {
              return {
                ...rfq,
                ...(data.date && { date: new Date(data.date) }),
                ...(data.currency && { currency: data.currency as Currency }),
                ...(data.value && { value: Number(data.value) }),
                ...(data.notes !== undefined && { notes: data.notes || null }),
                ...(data.authorId && {
                  authorId: data.authorId,
                  author: { ...rfq.author, id: data.authorId },
                }),
                ...(data.supplierId && {
                  supplierId: data.supplierId,
                  supplier: { ...rfq.supplier, id: data.supplierId },
                }),
                ...(data.clientId && {
                  clientId: data.clientId,
                  client: { ...rfq.client, id: data.clientId },
                }),
                ...(data.projectId && {
                  projectId: data.projectId,
                  project: { ...rfq.project, id: data.projectId },
                }),
                ...(data.rfqReceivedAt !== undefined && {
                  rfqReceivedAt: data.rfqReceivedAt
                    ? new Date(data.rfqReceivedAt)
                    : null,
                }),
                updatedAt: new Date(),
              };
            }
            return rfq;
          }),
        };
      });

      // Optimistically update the single RFQ
      queryClient.setQueryData(["rfq", data.id], (old: Rfq | undefined) => {
        if (!old) return old;
        return {
          ...old,
          ...(data.date && { date: new Date(data.date) }),
          ...(data.currency && { currency: data.currency as Currency }),
          ...(data.value && { value: Number(data.value) }),
          ...(data.notes !== undefined && { notes: data.notes || null }),
          ...(data.authorId && {
            authorId: data.authorId,
            author: { ...old.author, id: data.authorId },
          }),
          ...(data.supplierId && {
            supplierId: data.supplierId,
            supplier: { ...old.supplier, id: data.supplierId },
          }),
          ...(data.clientId && {
            clientId: data.clientId,
            client: { ...old.client, id: data.clientId },
          }),
          ...(data.projectId && {
            projectId: data.projectId,
            project: { ...old.project, id: data.projectId },
          }),
          ...(data.rfqReceivedAt !== undefined && {
            rfqReceivedAt: data.rfqReceivedAt
              ? new Date(data.rfqReceivedAt)
              : null,
          }),
          updatedAt: new Date(),
        };
      });

      return { previousRfqs, previousRfq };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfqsMetadata"] });
      toast.success("RFQ updated successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["rfqs"], context?.previousRfqs);
      queryClient.setQueryData(["rfq", variables.id], context?.previousRfq);
      toast.error(`Failed to update RFQ: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    },
  });
};

export const useDeleteRfq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRfq(id),
    mutationKey: ["deleteRfq"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["rfqs"] });
      await queryClient.cancelQueries({ queryKey: ["rfq", id] });
      const previousRfqs = queryClient.getQueryData(["rfqs"]);
      const previousRfq = queryClient.getQueryData(["rfq", id]);

      queryClient.setQueryData(["rfqs"], (old: GetRfqsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((rfq) => rfq.id !== id),
          total: Math.max(0, old.total - 1),
          pageCount: Math.ceil(
            Math.max(0, old.total - 1) / (old.data.length || 1)
          ),
        };
      });

      queryClient.removeQueries({ queryKey: ["rfq", id] });

      return { previousRfqs, previousRfq };
    },
    onSuccess: () => {
      toast.success("RFQ deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["rfqs"], context?.previousRfqs);
      if (context?.previousRfq) {
        queryClient.setQueryData(["rfq", variables], context.previousRfq);
      }
      toast.error(`Failed to delete RFQ: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfqsMetadata"] });
    },
  });
};
