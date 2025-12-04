"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";
import CreateNewCombobox from "@/components/create-new-combobox";
import { MaskInput } from "@/components/ui/mask-input";

import { createCompany } from "@/app/companies/_utils/create-company";
import { createProject } from "@/app/projects/_utils/create-project";
import { createPerson } from "@/app/people/_utils/create-person";
import { useUploadFiles } from "better-upload/client";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateQuote, useUpdateQuote } from "./use-quotes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReadPeople } from "@/app/people/_components/use-people";
import { mapToSelectOptions } from "@/lib/utils";
import { useReadCompanies } from "@/app/companies/_components/use-companies";
import { useReadProjects } from "@/app/projects/_components/use-projects";
import { CompanyType, PersonType } from "@/lib/enums";

const currencyEnum = z.enum(["EGP", "USD", "EUR", "GBP", "SAR", "AED"]);
const quoteOutcomeEnum = z.enum(["WON", "PENDING", "LOST"]);

const quoteFormSchema = z.object({
  referenceNumber: z.string().trim().optional(),
  date: z.string().trim().min(1, { message: "Date is required" }),
  currency: currencyEnum,
  value: z.string().min(1, { message: "Value is required" }),
  notes: z.string().trim().optional(),
  authorId: z.string().trim().min(1, { message: "Author is required" }),
  supplierId: z.string().trim().min(1, { message: "Supplier is required" }),
  clientId: z.string().trim().min(1, { message: "Client is required" }),
  projectId: z.string().trim().min(1, { message: "Project is required" }),
  quoteOutcome: quoteOutcomeEnum.optional(),
  contactPersonId: z
    .string()
    .trim()
    .min(1, { message: "Contact person is required" }),
  approximateSiteDeliveryDate: z.string().trim().optional(),
  objectKeys: z
    .array(z.string())
    .min(1, { message: "Related files are required" }),
});

export type QuoteForm = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  // default values could be passed in create mode too. for example, loading initial data from local storage.
  defaultValues?: QuoteForm;
  quoteId?: string;
  onSubmit: (data: QuoteForm) => void;
}

export function QuoteForm({
  defaultValues,
  quoteId,
  onSubmit,
}: QuoteFormProps) {
  const mode = quoteId ? "edit" : "add";
  const createQuote = useCreateQuote();
  const updateQuote = useUpdateQuote();

  const [currentCurrency, setCurrentCurrency] = useState("EGP");
  const queryClient = useQueryClient();

  const form = useForm<QuoteForm>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: defaultValues ?? {
      referenceNumber: "",
      date: "",
      currency: "EGP",
      value: "",
      notes: "",
      authorId: "",
      clientId: "",
      projectId: "",
      contactPersonId: "",
      supplierId: "",
      approximateSiteDeliveryDate: "",
      quoteOutcome: undefined,
      objectKeys: [],
    },
  });

  // fetch data needed for form
  const { data: projects } = useReadProjects();
  const { data: authors } = useReadPeople({
    type: [PersonType.AUTHOR],
  });
  const { data: contactPersons } = useReadPeople({
    type: [PersonType.CONTACT_PERSON],
  });
  const { data: clients } = useReadCompanies({
    type: [CompanyType.CLIENT],
  });
  const { data: suppliers } = useReadCompanies({
    type: [CompanyType.SUPPLIER],
  });

  const projectsInitialOptions = mapToSelectOptions(projects?.data);
  const contactPersonsInitialOptions = mapToSelectOptions(contactPersons?.data);
  const authorsInitialOptions = mapToSelectOptions(authors?.data);
  const clientsInitialOptions = mapToSelectOptions(clients?.data);
  const suppliersInitialOptions = mapToSelectOptions(suppliers?.data);

  const { control: uploadControl } = useUploadFiles({
    route: "form",
    onUploadComplete: ({ files }) => {
      form.setValue(
        "objectKeys",
        files.map((file) => file.objectKey)
      );
    },
    onError: (error) => {
      form.setError("objectKeys", {
        message: error.message || "An error occurred",
      });
    },
  });

  const submitQuote = async (data: QuoteForm) => {
    try {
      onSubmit(data);
      if (mode === "add") {
        await createQuote.mutateAsync(data);
      } else {
        await updateQuote.mutateAsync({ id: quoteId!, data });
      }
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quotesMetadata"] });
      uploadControl.reset();
      form.reset();
    } catch (e) {
      console.error("Error submitting quote:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitQuote)} className="space-y-6">
        <FieldGroup>
          {mode === "edit" && (
            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        const author = await createPerson({
                          id: value.id,
                          name: value.name,
                          type: PersonType.AUTHOR,
                        });
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        setCurrentCurrency(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">EGP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="SAR">SAR</SelectItem>
                        <SelectItem value="AED">AED</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <MaskInput
                      mask="currency"
                      currency={currentCurrency}
                      placeholder="Enter value"
                      value={field.value}
                      onValueChange={(_maskedValue, unmaskedValue) => {
                        field.onChange(unmaskedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={clientsInitialOptions}
                      createNewFunction={async (value) => {
                        const client = await createCompany({
                          id: value.id,
                          name: value.name,
                          type: CompanyType.CLIENT,
                        });
                        return client.id;
                      }}
                      label="client"
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
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={suppliersInitialOptions}
                      createNewFunction={async (value) => {
                        const supplier = await createCompany({
                          id: value.id,
                          name: value.name,
                          type: CompanyType.SUPPLIER,
                        });

                        return supplier.id;
                      }}
                      label="supplier"
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
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={projectsInitialOptions}
                      createNewFunction={async (value) => {
                        const projectWithCompany = {
                          ...value,
                          companyId: form.getValues("clientId") ?? undefined,
                        };
                        const project = await createProject(projectWithCompany);
                        return project.id;
                      }}
                      label="project"
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
              name="contactPersonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={contactPersonsInitialOptions}
                      createNewFunction={async (value) => {
                        const withCompany = {
                          ...value,
                          companyId: form.getValues("clientId") ?? undefined,
                          type: PersonType.CONTACT_PERSON,
                        };
                        const contactPerson = await createPerson(withCompany);
                        return contactPerson.id;
                      }}
                      label="contact person"
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
              name="approximateSiteDeliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Approx. Site Delivery Date{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quoteOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quote Outcome{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) =>
                        field.onChange(value || undefined)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select quote outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WON">Won</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="LOST">Lost</SelectItem>
                      </SelectContent>
                    </Select>
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
                <FormLabel>
                  Notes{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </FormLabel>
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
          name="objectKeys"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Files</FormLabel>
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
            "Save Quote"
          )}
        </Button>
      </form>
    </Form>
  );
}
