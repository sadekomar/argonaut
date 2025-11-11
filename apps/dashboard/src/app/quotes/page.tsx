"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { useEffect, useState } from "react";
import CreateNewCombobox from "@/components/create-new-combobox";
import {
  createAuthor,
  createClient,
  createContactPerson,
  createProject,
  createSupplier,
} from "./_utils/create-supplier";
import {
  readAuthors,
  readClients,
  readContactPersons,
  readProjects,
  readSuppliers,
} from "./_hooks/read-suppliers";
import { useUploadFiles } from "better-upload/client";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";
import { createQuote } from "./_utils/create-quote";
import { useQuery } from "@tanstack/react-query";

// Based on packages/database/prisma/schema.prisma → Quote model
const currencyEnum = z.enum(["EGP", "USD", "EUR", "GBP", "SAR", "AED"]);

const addQuoteSchema = z.object({
  date: z.string().trim().min(1, { message: "Date is required" }),
  currency: currencyEnum,
  value: z.string().min(1, { message: "Value is required" }),
  notes: z.string().trim().optional(),
  authorId: z.string().trim().min(1, { message: "Author is required" }),
  supplierId: z.string().trim().min(1, { message: "Supplier is required" }),
  clientId: z.string().trim().min(1, { message: "Client is required" }),
  projectId: z.string().trim().min(1, { message: "Project is required" }),
  contactPersonId: z
    .string()
    .trim()
    .min(1, { message: "Contact person is required" }),
  approximateSiteDeliveryDate: z.string().trim().optional(),
  objectKeys: z
    .array(z.string())
    .min(1, { message: "Related files are required" }),
});

export type AddQuoteForm = z.infer<typeof addQuoteSchema>;

export default function AddQuote() {
  const form = useForm<AddQuoteForm>({
    resolver: zodResolver(addQuoteSchema),
    defaultValues: {
      date: "",
      currency: "EGP",
      value: "",
      notes: "",
      clientId: "",
      projectId: "",
      contactPersonId: "",
      supplierId: "",
      approximateSiteDeliveryDate: "",
      objectKeys: [],
    },
  });

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

  const onSubmit = async (data: any) => {
    console.log("✅ onSubmit called! Data:", data);
    try {
      console.log("Submitting quote:", data);
      createQuote(data);
    } catch (e) {
      console.error("Error submitting quote:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    } finally {
      uploadControl.reset();
      form.reset();
    }
  };

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: readProjects,
  });
  const { data: contactPersons = [] } = useQuery({
    queryKey: ["contactPersons"],
    queryFn: readContactPersons,
  });
  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: readAuthors,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: readClients,
  });
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: readSuppliers,
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.webp" alt="Argonaut" width={20} height={20} />
          Argonaut
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Add Quote</CardTitle>
              <CardDescription>Enter quote details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("Form validation errors:", errors);
                    console.log("Form values:", form.getValues());
                  })}
                  className="space-y-6"
                >
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...field}
                              >
                                <option value="" disabled>
                                  Select currency
                                </option>
                                <option value="EGP">EGP</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="SAR">SAR</option>
                                <option value="AED">AED</option>
                              </select>
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
                              <Input
                                type="number"
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
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client</FormLabel>
                            <FormControl>
                              <CreateNewCombobox
                                initialOptions={clients}
                                createNewFunction={async (value) => {
                                  const client = await createClient(value);

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
                                initialOptions={suppliers}
                                createNewFunction={async (value) => {
                                  const supplier = await createSupplier(value);

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
                                initialOptions={projects}
                                createNewFunction={async (value) => {
                                  const projectWithCompany = {
                                    ...value,
                                    companyId:
                                      form.getValues("clientId") ?? undefined,
                                  };
                                  const project =
                                    await createProject(projectWithCompany);

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
                                initialOptions={contactPersons}
                                createNewFunction={async (value) => {
                                  const withCompany = {
                                    ...value,
                                    companyId:
                                      form.getValues("clientId") ?? undefined,
                                  };

                                  const contactPerson =
                                    await createContactPerson(withCompany);

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
                            <FormLabel>Approx. Site Delivery Date</FormLabel>
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
                    className="w-full cursor-pointer"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Save Quote"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
