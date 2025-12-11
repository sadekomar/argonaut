import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  readFollowUps,
  readFollowUpsMetadata,
} from "../_utils/read-follow-ups";
import { updateFollowUp, UpdateFollowUpForm } from "../_utils/update-follow-up";
import { deleteFollowUp } from "../_utils/delete-follow-up";
import { createFollowUp, CreateFollowUpForm } from "../_utils/create-follow-up";
import { toast } from "sonner";

export type GetFollowUpsResponse = Awaited<ReturnType<typeof readFollowUps>>;
export type GetFollowUpsDataResponse = GetFollowUpsResponse["data"];

// Utility functions
function handleAbort<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    return fn(...args);
  };
}

export const useGetFollowUps = (
  params?: Parameters<typeof readFollowUps>[0]
) => {
  return useQuery({
    queryKey: ["followUps", params],
    queryFn: () => readFollowUps(params),
  });
};

export const useGetFollowUpsMetadata = () => {
  return useQuery({
    queryKey: ["followUpsMetadata"],
    queryFn: readFollowUpsMetadata,
  });
};

export const useCreateFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFollowUpForm) => createFollowUp(data),
    mutationKey: ["createFollowUp"],
    onSuccess: () => {
      toast.success("Follow-up created successfully");
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "followUps",
      });
      queryClient.invalidateQueries({ queryKey: ["followUpsMetadata"] });
    },
    onError: (error) => {
      toast.error(`Failed to create follow-up: ${error.message}`);
    },
  });
};

export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFollowUpForm) => updateFollowUp(data),
    mutationKey: ["updateFollowUp"],
    onSuccess: () => {
      toast.success("Follow-up updated successfully");
      queryClient.invalidateQueries({ queryKey: ["followUps"] });
      queryClient.invalidateQueries({ queryKey: ["followUpsMetadata"] });
    },
    onError: (error) => {
      toast.error(`Failed to update follow-up: ${error.message}`);
    },
  });
};

export const useEditFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFollowUpForm) => updateFollowUp(data),
    mutationKey: ["editFollowUp"],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["followUps"] });
      const previousFollowUps = queryClient.getQueryData(["followUps"]);

      // Optimistically update the follow-up in the list
      queryClient.setQueryData(
        ["followUps"],
        (old: GetFollowUpsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((followUp) => {
              if (followUp.id === data.id) {
                return {
                  ...followUp,
                  ...(data.quoteId && {
                    quoteId: data.quoteId,
                    quote: { ...followUp.quote, id: data.quoteId },
                  }),
                  ...(data.authorId && {
                    authorId: data.authorId,
                    author: { ...followUp.author, id: data.authorId },
                  }),
                  ...(data.notes !== undefined && {
                    notes: data.notes || null,
                  }),
                  updatedAt: new Date(),
                };
              }
              return followUp;
            }),
          };
        }
      );

      return { previousFollowUps };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followUps"] });
      queryClient.invalidateQueries({ queryKey: ["followUpsMetadata"] });
      toast.success("Follow-up updated successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["followUps"], context?.previousFollowUps);
      toast.error(`Failed to update follow-up: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["followUps"] });
    },
  });
};

export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFollowUp(id),
    mutationKey: ["deleteFollowUp"],
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["followUps"] });
      const previousFollowUps = queryClient.getQueryData(["followUps"]);

      queryClient.setQueryData(
        ["followUps"],
        (old: GetFollowUpsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((followUp) => followUp.id !== id),
            total: Math.max(0, old.total - 1),
            pageCount: Math.ceil(
              Math.max(0, old.total - 1) / (old.data.length || 1)
            ),
          };
        }
      );

      return { previousFollowUps };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followUps"] });
      queryClient.invalidateQueries({ queryKey: ["followUpsMetadata"] });
      toast.success("Follow-up deleted successfully");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["followUps"], context?.previousFollowUps);
      toast.error(`Failed to delete follow-up: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["followUps"] });
      queryClient.invalidateQueries({ queryKey: ["followUpsMetadata"] });
    },
  });
};
