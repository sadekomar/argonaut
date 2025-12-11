import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  readRegistrations,
  readRegistrationsMetadata,
} from "../_utils/read-registrations";
import {
  updateRegistration,
  UpdateRegistrationForm,
} from "../_utils/update-registration";
import { deleteRegistration } from "../_utils/delete-registration";
import { createRegistration, AddRegistrationForm } from "../_utils/create-registration";
import { toast } from "sonner";

export type GetRegistrationsResponse = Awaited<
  ReturnType<typeof readRegistrations>
>;
export type GetRegistrationsDataResponse = GetRegistrationsResponse["data"];

export const useGetRegistrations = (
  params?: Parameters<typeof readRegistrations>[0]
) => {
  return useQuery({
    queryKey: ["registrations", params],
    queryFn: () => readRegistrations(params),
  });
};

export const useGetRegistrationsMetadata = () => {
  return useQuery({
    queryKey: ["registrationsMetadata"],
    queryFn: readRegistrationsMetadata,
  });
};

export const useCreateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createRegistration"],
    mutationFn: (data: AddRegistrationForm) => createRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      toast.success("Registration created successfully", {
        description: "The registration has been created successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to create registration", {
        description: error.message || "The registration could not be created.",
      });
    },
  });
};

export const useUpdateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateRegistration"],
    mutationFn: (data: UpdateRegistrationForm) => updateRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      toast.success("Registration updated successfully", {
        description: "The registration has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to update registration", {
        description: error.message || "The registration could not be updated.",
      });
    },
  });
};

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteRegistration"],
    mutationFn: (id: string) => deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      toast.success("Registration deleted successfully", {
        description: "The registration has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to delete registration", {
        description: error.message || "The registration could not be deleted.",
      });
    },
  });
};
