"use client";

import { Uploader } from "@/components/uploader";
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
} from "./utils/create-supplier";
import { readSuppliers } from "./hooks/readSuppliers";

// Based on packages/database/prisma/schema.prisma → Quote model
const currencyEnum = z.enum(["EGP", "USD", "EUR", "GBP", "SAR", "AED"]);

const addQuoteSchema = z.object({
  referenceNumber: z
    .string()
    .trim()
    .min(1, { message: "Reference number is required" }),
  date: z.string().trim().min(1, { message: "Date is required" }),
  currency: currencyEnum,
  value: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Value must be a non-negative integer" }),
  notes: z.string().trim().optional(),
  author: z.string().trim().min(1, { message: "Author is required" }),
  supplier: z.string().trim().optional(),
  client: z.string().trim().min(1, { message: "Client is required" }),
  project: z.string().trim().min(1, { message: "Project is required" }),
  contactPerson: z
    .string()
    .trim()
    .min(1, { message: "Contact person is required" }),
  approximateSiteDeliveryDate: z
    .string()
    .trim()
    .min(1, { message: "Approx. delivery date is required" }),
});

type AddQuoteInput = z.infer<typeof addQuoteSchema>;

export default function AddQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(addQuoteSchema),
    defaultValues: {
      referenceNumber: "",
      date: "",
      currency: undefined,
      rate: undefined as unknown as number,
      value: undefined as unknown as number,
      notes: "",
      clientId: "",
      projectId: "",
      contactPersonId: "",
      supplierId: "",
      approximateSiteDeliveryDate: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const payload = {
        ...data,
        date: new Date(data.date),
        approximateSiteDeliveryDate: new Date(data.approximateSiteDeliveryDate),
      };
      // Integration point: POST to your quotes API
      // await fetch("/api/quotes", { method: "POST", body: JSON.stringify(payload) });
      console.log("Submitting quote:", payload);
      setIsSuccess(true);
      form.reset();
    } catch (e) {
      form.setError("referenceNumber", {
        message: "Failed to submit. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchSuppliers = async () => {
  //     const suppliers = await readSuppliers();
  //     const supplierOptions = suppliers.map((supplier) => ({
  //       value: supplier.id,
  //       label: supplier.name,
  //     }));
  //     return supplierOptions;
  //   };

  //   fetchSuppliers();
  // }, []);

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
              <CardDescription>
                {isSuccess
                  ? "Quote captured locally. Connect API to persist."
                  : "Enter quote details below."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="referenceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ARGO-Q-2xxx-mm-yyyy"
                                {...field}
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
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
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
                                placeholder="e.g. 100000"
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
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <CreateNewCombobox
                                initialOptions={[]}
                                createNewFunction={(value) => {
                                  createAuthor(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier</FormLabel>
                            <FormControl>
                              <CreateNewCombobox
                                initialOptions={[
                                  { value: "nestle", label: "Nestle" },
                                  { value: "unilever", label: "Unilever" },
                                  {
                                    value: "procter-and-gamble",
                                    label: "Procter & Gamble",
                                  },
                                ]}
                                createNewFunction={(value) => {
                                  createSupplier(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cient"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client</FormLabel>
                            <FormControl>
                              <CreateNewCombobox
                                initialOptions={[]}
                                createNewFunction={(value) => {
                                  createClient(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="project"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project</FormLabel>
                            <FormControl>
                              <CreateNewCombobox
                                initialOptions={[]}
                                createNewFunction={(value) => {
                                  createProject(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <CreateNewCombobox
                                initialOptions={[]}
                                createNewFunction={(value) => {
                                  createContactPerson(value);
                                }}
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Files</FormLabel>
                        <FormControl>
                          <Uploader />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Field>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full cursor-pointer"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Save Quote"
                      )}
                    </Button>
                  </Field>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
