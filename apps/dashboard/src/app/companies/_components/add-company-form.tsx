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
import { createCompany } from "../_utils/create-company";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const companyTypeEnum = z.enum([
  "SUPPLIER",
  "CLIENT",
  "CONTRACTOR",
  "CONSULTANT",
]);

const addCompanySchema = z.object({
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

export type AddCompanyForm = z.infer<typeof addCompanySchema>;

export function AddCompanyForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<AddCompanyForm>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "CLIENT",
    },
  });

  const submitCompany = async (data: AddCompanyForm) => {
    try {
      const result = await createCompany({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        type: data.type,
      });

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        queryClient.invalidateQueries({ queryKey: ["companiesMetadata"] });
        router.push("/companies");
      } else if (result.errors) {
        // Handle form errors
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof AddCompanyForm, {
            message: messages?.[0] || "An error occurred",
          });
        });
      }
    } catch (e) {
      console.error("Error submitting company:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitCompany, (errors) => {
          console.log("Form validation errors:", errors);
        })}
        className="space-y-6"
      >
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
