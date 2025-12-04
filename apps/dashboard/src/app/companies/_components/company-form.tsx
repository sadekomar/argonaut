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
import { useCreateCompany, useUpdateCompany } from "./use-companies";

const companyTypeEnum = z.enum([
  "SUPPLIER",
  "CLIENT",
  "CONTRACTOR",
  "CONSULTANT",
]);

const createCompanySchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z
    .string()
    .trim()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid email address",
    })
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  type: companyTypeEnum,
});

export type CreateCompanyForm = z.infer<typeof createCompanySchema>;

export function CompanyForm({
  defaultValues,
  companyId,
  onSubmit,
}: {
  defaultValues: CreateCompanyForm;
  companyId: string;
  onSubmit: () => void;
}) {
  const mode = companyId ? "edit" : "create";
  const { mutateAsync: createCompany } = useCreateCompany();
  const { mutateAsync: updateCompany } = useUpdateCompany();

  const form = useForm<CreateCompanyForm>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const submitCompany = async (data: CreateCompanyForm) => {
    try {
      if (mode === "create") {
        await createCompany(data);
      } else {
        await updateCompany({ id: companyId, ...data });
      }
    } catch (error) {
      console.error("Error submitting company:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitCompany)} className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="CLIENT">Client</option>
                      <option value="SUPPLIER">Supplier</option>
                      <option value="CONTRACTOR">Contractor</option>
                      <option value="CONSULTANT">Consultant</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FieldGroup>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save Company"
          )}
        </Button>
      </form>
    </Form>
  );
}
