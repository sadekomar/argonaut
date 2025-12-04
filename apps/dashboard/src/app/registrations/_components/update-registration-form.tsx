"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import CreateNewCombobox from "@/components/create-new-combobox";
import { createClient } from "@/app/companies/_utils/create-company";
import { createAuthor } from "@/app/people/_utils/create-person";
import { readAuthors, readClients } from "../../quotes/_utils/read-suppliers";
import { useUploadFiles } from "better-upload/client";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";
import {
  updateRegistration,
  UpdateRegistrationForm as UpdateForm,
} from "../_utils/update-registration";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readAllCompanies } from "../_utils/read-companies";
import { useGetRegistrations } from "./use-registrations";
import { useEffect } from "react";

const registrationStatusEnum = z.enum([
  "PURSUING",
  "REQUIREMENTS_COLLECTED",
  "DOCS_SENT",
  "UNDER_REVIEW",
  "PENDING_CONFIRMATION",
  "VERIFIED",
  "ON_HOLD",
  "DECLINED",
]);

const updateRegistrationSchema = z.object({
  companyId: z.string().trim().min(1, { message: "Company is required" }),
  registrationStatus: registrationStatusEnum,
  authorId: z.string().trim().min(1, { message: "Author is required" }),
  registrationFile: z.string().optional(),
  notes: z.string().trim().optional(),
});

type UpdateRegistrationFormData = z.infer<typeof updateRegistrationSchema>;

interface UpdateRegistrationFormProps {
  registrationId: string;
  onSuccess?: () => void;
}

export function UpdateRegistrationForm({
  registrationId,
  onSuccess,
}: UpdateRegistrationFormProps) {
  const queryClient = useQueryClient();

  // Fetch the registration data
  const { data: registrationsData } = useGetRegistrations({ perPage: 1000 });
  const registration = registrationsData?.data?.find(
    (r) => r.id === registrationId
  );

  const form = useForm<UpdateRegistrationFormData>({
    resolver: zodResolver(updateRegistrationSchema),
    defaultValues: {
      companyId: "",
      registrationStatus: "PURSUING",
      authorId: "",
      registrationFile: "",
      notes: "",
    },
  });

  // Populate form when registration data is loaded
  useEffect(() => {
    if (registration) {
      form.reset({
        companyId: registration.companyId,
        registrationStatus: registration.registrationStatus as any,
        authorId: registration.authorId,
        registrationFile: registration.registrationFile || "",
        notes: registration.notes || "",
      });
    }
  }, [registration, form]);

  const { control: uploadControl } = useUploadFiles({
    route: "form",
    onUploadComplete: ({ files }) => {
      if (files.length > 0) {
        form.setValue("registrationFile", files[0].objectKey);
      }
    },
    onError: (error) => {
      form.setError("registrationFile", {
        message: error.message || "An error occurred",
      });
    },
  });

  const submitRegistration = async (data: UpdateRegistrationFormData) => {
    try {
      await updateRegistration({
        id: registrationId,
        ...data,
      });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      uploadControl.reset();
      onSuccess?.();
    } catch (e) {
      console.error("Error updating registration:", e);
      form.setError("root", {
        message: "Failed to update. Please try again.",
      });
    }
  };

  const { data: companies = [] } = useQuery({
    queryKey: ["allCompanies"],
    queryFn: readAllCompanies,
  });
  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: readAuthors,
  });

  if (!registration) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitRegistration)}
        className="space-y-6"
      >
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={companies}
                      createNewFunction={async (value) => {
                        const company = await createClient(value);
                        return company.id;
                      }}
                      label="company"
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="PURSUING">Pursuing</option>
                      <option value="REQUIREMENTS_COLLECTED">
                        Requirements Collected
                      </option>
                      <option value="DOCS_SENT">Docs Sent</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="PENDING_CONFIRMATION">
                        Pending Confirmation
                      </option>
                      <option value="VERIFIED">Verified</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="DECLINED">Declined</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={authors}
                      createNewFunction={async (value) => {
                        const author = await createAuthor(value);
                        return author.id;
                      }}
                      label="author"
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <textarea
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Additional notes…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>

        <FormField
          control={form.control}
          name="registrationFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration File</FormLabel>
              <FormControl>
                <UploadDropzoneProgress control={uploadControl} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Update Registration"
          )}
        </Button>
      </form>
    </Form>
  );
}
