import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readPeople, readPeopleMetadata } from "../_utils/read-people";
import { updatePerson, UpdatePersonForm } from "../_utils/update-person";
import { deletePerson } from "../_utils/delete-person";
import { createPerson, CreatePersonForm } from "../_utils/create-person";
import { toast } from "sonner";

export type GetPeopleResponse = Awaited<ReturnType<typeof readPeople>>;
export type GetPeopleDataResponse = GetPeopleResponse["data"];

export const useReadPeople = (params?: Parameters<typeof readPeople>[0]) => {
  return useQuery({
    queryKey: ["people", params],
    queryFn: () => readPeople(params),
  });
};

export const useGetPeopleMetadata = () => {
  return useQuery({
    queryKey: ["peopleMetadata"],
    queryFn: readPeopleMetadata,
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createPerson"],
    mutationFn: (data: CreatePersonForm) => createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
      toast.success("Person created successfully", {
        description: "The person has been created successfully.",
      });
      // because the ids don't match so it doesn't select it anymore that's what happens actually
    },
    onError: (error) => {
      toast.error("Failed to create person", {
        description: error.message || "The person could not be created.",
      });
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePerson"],
    mutationFn: (data: UpdatePersonForm) => updatePerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
      toast.success("Person updated successfully", {
        description: "The person has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to update person", {
        description: error.message || "The person could not be updated.",
      });
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletePerson"],
    mutationFn: (id: string) => deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
      toast.success("Person deleted successfully", {
        description: "The person has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to delete person", {
        description: error.message || "The person could not be deleted.",
      });
    },
  });
};
