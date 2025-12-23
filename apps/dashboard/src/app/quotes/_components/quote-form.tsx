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
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import CreateNewCombobox from "@/components/create-new-combobox";
import { MaskInput } from "@/components/ui/mask-input";

import { useUploadFiles } from "better-upload/client";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";
import { useCreateQuote, useUpdateQuote } from "./use-quotes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreatePerson,
  useReadPeople,
} from "@/app/people/_components/use-people";
import { mapToSelectOptions } from "@/lib/utils";
import {
  useCreateCompany,
  useReadCompanies,
} from "@/app/companies/_components/use-companies";
import {
  useCreateProject,
  useReadProjects,
} from "@/app/projects/_components/use-projects";
import { CompanyType, PersonType } from "@/lib/enums";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { Quote } from "./quotes-table";
import { getSortingStateParser } from "@/lib/parsers";
import React from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateRfq, useReadRfqs } from "@/app/rfqs/_components/use-rfqs";

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
  // include names in mutation for optimistic updates
  authorName: z.string().trim().optional(),
  supplierName: z.string().trim().optional(),
  clientName: z.string().trim().optional(),
  projectName: z.string().trim().optional(),
  contactPersonName: z.string().trim().optional(),
  contactPersonPhone: z.string().trim().optional(),
  contactPersonEmail: z.string().trim().optional(),
  rfqId: z.string().trim().optional(),
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

  const createQuote = useGenerateCreateQuote();
  const updateQuote = useUpdateQuote();
  const queryClient = useQueryClient();

  const [isNewContactPerson, setIsNewContactPerson] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState("EGP");
  const [existingObjectKeys, setExistingObjectKeys] = useState(
    defaultValues?.objectKeys ?? []
  );
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  React.useEffect(() => {
    setExistingObjectKeys(defaultValues?.objectKeys ?? []);
  }, [defaultValues?.objectKeys]);

  const handleDeleteFile = async (objectKey: string) => {
    if (!quoteId) return;
    setDeletingKey(objectKey);
    try {
      const response = await fetch(
        `/api/upload/${encodeURIComponent(objectKey)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quoteId }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const firstError =
          (errorBody as { error?: string })?.error ||
          (() => {
            const values = Object.values(errorBody as Record<string, unknown>);
            const firstValue = values[0];
            if (Array.isArray(firstValue)) return firstValue[0] as string;
            if (typeof firstValue === "string") return firstValue;
            return undefined;
          })() ||
          "Failed to delete file";
        throw new Error(firstError);
      }

      setExistingObjectKeys((prev) => prev.filter((key) => key !== objectKey));
      form.setValue(
        "objectKeys",
        (form.getValues("objectKeys") ?? []).filter((key) => key !== objectKey)
      );

      // Invalidate all quote queries regardless of their params
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "quotes",
      });

      toast.success("File deleted");
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file", {
        description: error?.message ?? "Please try again.",
      });
    } finally {
      setDeletingKey(null);
    }
  };

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
      contactPersonPhone: "",
      contactPersonEmail: "",
      supplierId: "",
      approximateSiteDeliveryDate: "",
      objectKeys: [],
      rfqId: "",
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
    type: [CompanyType.CLIENT, CompanyType.CONSULTANT, CompanyType.CONTRACTOR],
  });
  const { data: suppliers } = useReadCompanies({
    type: [CompanyType.SUPPLIER],
  });
  const { data: rfqs } = useReadRfqs();

  const { mutate: createPerson } = useCreatePerson();
  const { mutate: createCompany } = useCreateCompany();
  const { mutate: createProject } = useCreateProject();

  const projectsInitialOptions = mapToSelectOptions(projects?.data);
  const contactPersonsInitialOptions = mapToSelectOptions(contactPersons?.data);
  const authorsInitialOptions = mapToSelectOptions(authors?.data);
  const clientsInitialOptions = mapToSelectOptions(clients?.data);
  const suppliersInitialOptions = mapToSelectOptions(suppliers?.data);
  const rfqsInitialOptions = mapToSelectOptions(
    rfqs?.data?.map((rfq) => ({
      ...rfq,
      name: rfq.referenceNumber,
    }))
  );

  const { control: uploadControl } = useUploadFiles({
    route: "form",
    onUploadComplete: ({ files }) => {
      const newObjectKeys = files.map((file) => file.objectKey);

      if (mode == "edit") {
        const currentObjectKeys = form.getValues("objectKeys") ?? [];
        const updatedObjectKeys = [...currentObjectKeys, ...newObjectKeys];

        form.setValue("objectKeys", updatedObjectKeys);
        updateQuote.mutate({
          id: quoteId!,
          data: {
            objectKeys: updatedObjectKeys,
          },
        });
      } else {
        form.setValue("objectKeys", newObjectKeys);
      }
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
        createQuote.mutate({
          ...data,
          authorName: authorsInitialOptions.find(
            (author) => author.value === data.authorId
          )?.label,
          supplierName: suppliersInitialOptions?.find(
            (supplier) => supplier.value === data.supplierId
          )?.label,
          clientName: clientsInitialOptions?.find(
            (client) => client.value === data.clientId
          )?.label,
          projectName: projectsInitialOptions?.find(
            (project) => project.value === data.projectId
          )?.label,
          contactPersonName: contactPersonsInitialOptions?.find(
            (contactPerson) => contactPerson.value === data.contactPersonId
          )?.label,
        });
      } else {
        await updateQuote.mutateAsync({ id: quoteId!, data });
      }
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
                      disableCreateNew={true}
                      createNewFunction={async (value) => {
                        createPerson({
                          id: value.id,
                          name: value.name,
                          type: PersonType.AUTHOR,
                        });
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
                        try {
                          createCompany({
                            id: value.id,
                            name: value.name,
                            type: CompanyType.CLIENT,
                          });
                        } catch (error) {
                          form.setError("clientId", {
                            message: "Client with this name already exists",
                          });
                          return null;
                        }
                      }}
                      label="client"
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        form.clearErrors("clientId");
                        field.onChange(value);
                      }}
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
                        try {
                          createCompany({
                            id: value.id,
                            name: value.name,
                            type: CompanyType.SUPPLIER,
                          });
                        } catch (error) {
                          form.setError("supplierId", {
                            message: "Supplier with this name already exists",
                          });
                        }
                      }}
                      label="supplier"
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        form.clearErrors("supplierId");
                        field.onChange(value);
                      }}
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
                        createProject(projectWithCompany);
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
                        setIsNewContactPerson(true);
                        contactPersonsInitialOptions.push({
                          value: value.id,
                          label: value.name,
                        });
                        const withCompany = {
                          ...value,
                          companyId: form.getValues("clientId") ?? undefined,
                          type: PersonType.CONTACT_PERSON,
                        };
                        createPerson(withCompany);
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
            {isNewContactPerson && (
              <>
                <FormField
                  control={form.control}
                  name="contactPersonPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Person Phone
                        <span className="text-muted-foreground">
                          (Optional)
                        </span>{" "}
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPersonEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Person Email
                        <span className="text-muted-foreground">
                          (Optional)
                        </span>{" "}
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
            {mode === "edit" && (
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
            )}
          </div>
          <FormField
            control={form.control}
            name="rfqId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  RFQ <span className="text-muted-foreground">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <CreateNewCombobox
                    initialOptions={rfqsInitialOptions}
                    disableCreateNew={true}
                    createNewFunction={async (value) => {
                      console.log("cannot create new RFQ from quote form");
                    }}
                    label="rfq"
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

        {mode === "edit" && (
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Related Files
            </label>
            {existingObjectKeys.length > 0 ? (
              <div className="space-y-2">
                {existingObjectKeys.map((objectKey, index) => (
                  <div
                    key={objectKey}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          File {index + 1}
                        </p>
                        <p className="text-xs text-muted-foreground text-wrap truncate">
                          {objectKey}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={`/api/upload/${encodeURIComponent(objectKey)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                      {quoteId && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingKey === objectKey}
                          onClick={() => handleDeleteFile(objectKey)}
                        >
                          {deletingKey === objectKey ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No files associated with this quote.
              </p>
            )}
          </div>
        )}

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
function useGenerateCreateQuote() {
  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

  const columnIds = React.useMemo(
    () =>
      new Set([
        "referenceNumber",
        "date",
        "client",
        "supplier",
        "project",
        "author",
        "value",
        "currency",
        "quoteOutcome",
        "approximateSiteDeliveryDate",
      ]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Quote>(columnIds).withDefault([])
  );

  const [filters] = useQueryStates({
    date: parseAsString,
    referenceNumber: parseAsString.withDefault(""),
    client: parseAsArrayOf(parseAsString).withDefault([]),
    supplier: parseAsArrayOf(parseAsString).withDefault([]),
    project: parseAsArrayOf(parseAsString).withDefault([]),
    author: parseAsArrayOf(parseAsString).withDefault([]),
    currency: parseAsArrayOf(parseAsString).withDefault([]),
    quoteOutcome: parseAsArrayOf(parseAsString).withDefault([]),
    approximateSiteDeliveryDate: parseAsString,
  });

  const createQuote = useCreateQuote({
    page: pagination.page,
    perPage: pagination.perPage,
    sort: sort,
    date: filters.date ?? undefined,
    referenceNumber: filters.referenceNumber,
    client: filters.client,
    supplier: filters.supplier,
    project: filters.project,
    author: filters.author,
    currency: filters.currency,
    quoteOutcome: filters.quoteOutcome,
    approximateSiteDeliveryDate:
      filters.approximateSiteDeliveryDate ?? undefined,
  });
  return createQuote;
}
