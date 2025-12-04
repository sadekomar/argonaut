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
import CreateNewCombobox from "@/components/create-new-combobox";
import { createPerson } from "../_utils/create-person";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readAllCompanies } from "../../registrations/_utils/read-companies";
import { createClient } from "../../quotes/_utils/create-supplier";

const personTypeEnum = z.enum(["AUTHOR", "CONTACT_PERSON", "INTERNAL"]);

const addPersonSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  companyId: z.string().trim().optional(),
  type: personTypeEnum,
});

export type AddPersonForm = z.infer<typeof addPersonSchema>;

export function AddPersonForm() {
  const queryClient = useQueryClient();

  const form = useForm<AddPersonForm>({
    resolver: zodResolver(addPersonSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyId: "",
      type: "INTERNAL",
    },
  });

  const submitPerson = async (data: AddPersonForm) => {
    try {
      await createPerson({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        companyId: data.companyId || undefined,
        type: data.type,
      });
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["peopleMetadata"] });
      form.reset();
    } catch (e) {
      console.error("Error submitting person:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

  const { data: companies = [] } = useQuery({
    queryKey: ["allCompanies"],
    queryFn: readAllCompanies,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitPerson)} className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
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
                      placeholder="Enter email"
                      {...field}
                      value={field.value ?? ""}
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
                      placeholder="Enter phone"
                      {...field}
                      value={field.value ?? ""}
                    />
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
                      <option value="INTERNAL">Internal</option>
                      <option value="AUTHOR">Author</option>
                      <option value="CONTACT_PERSON">Contact Person</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        const client = await createClient(value);
                        return client.id;
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
          </div>
        </FieldGroup>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save Person"
          )}
        </Button>
      </form>
    </Form>
  );
}
