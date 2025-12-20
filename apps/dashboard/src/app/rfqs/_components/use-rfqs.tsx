import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readRfq, readRfqs, readRfqsMetadata } from "../_utils/read-rfqs";
import { createRfq } from "../_utils/create-rfq";
import { deleteRfq } from "../_utils/delete-rfq";
import { updateRfq } from "../_utils/update-rfq";
import { RfqForm } from "./rfq-form";
import { toast } from "sonner";

type Currency = "EGP" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

function handleAbort<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    return fn(...args);
  };
}

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
  quote: {
    id: string;
    referenceNumber: string;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type GetRfqsResponse = Awaited<ReturnType<typeof readRfqs>>;
export type GetRfqsDataResponse = GetRfqsResponse["data"];

export const useReadRfq = (id: string) => {
  return useQuery({
    queryKey: ["rfq", id],
    queryFn: handleAbort(() => readRfq(id)),
    enabled: !!id,
  });
};

export const useReadRfqs = (params?: Parameters<typeof readRfqs>[0]) => {
  return useQuery({
    queryKey: ["rfqs", params],
    queryFn: () => readRfqs(params),
  });
};

export const useReadRfqsMetadata = () => {
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

export const useCreateRfq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RfqForm) => createRfq(data),
    mutationKey: ["createRfq"],
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

export const useUpdateRfq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RfqForm> }) =>
      updateRfq(id, data),
    mutationKey: ["updateRfq"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfqsMetadata"] });
      toast.success("RFQ updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update RFQ: ${error.message}`);
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
