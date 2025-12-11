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
import { useUploadFiles } from "better-upload/client";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";
import { createRegistration } from "../_utils/create-registration";
import { useQueryClient } from "@tanstack/react-query";
import { useReadCompanies } from "@/app/companies/_components/use-companies";
import { useReadPeople } from "@/app/people/_components/use-people";
import { PersonType } from "@/lib/enums";
import { mapToSelectOptions } from "@/lib/utils";

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

const addRegistrationSchema = z.object({
  companyId: z.string().trim().min(1, { message: "Company is required" }),
  registrationStatus: registrationStatusEnum,
  authorId: z.string().trim().min(1, { message: "Author is required" }),
  registrationFile: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type AddRegistrationForm = z.infer<typeof addRegistrationSchema>;

export function AddRegistrationForm() {
  const queryClient = useQueryClient();

  const form = useForm<AddRegistrationForm>({
    resolver: zodResolver(addRegistrationSchema),
    defaultValues: {
      companyId: "",
      registrationStatus: "PURSUING",
      authorId: "",
      registrationFile: "",
      notes: "",
    },
  });

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

  const submitRegistration = async (data: AddRegistrationForm) => {
    try {
      await createRegistration(data);
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationsMetadata"] });
      uploadControl.reset();
      form.reset();
    } catch (e) {
      console.error("Error submitting registration:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

  const { data: companies } = useReadCompanies();
  const { data: authors } = useReadPeople({
    type: [PersonType.AUTHOR],
  });

  const companiesInitialOptions = mapToSelectOptions(companies?.data);
  const authorsInitialOptions = mapToSelectOptions(authors?.data);

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
                      initialOptions={companiesInitialOptions}
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
                      initialOptions={authorsInitialOptions}
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
            "Save Registration"
          )}
        </Button>
      </form>
    </Form>
  );
}
