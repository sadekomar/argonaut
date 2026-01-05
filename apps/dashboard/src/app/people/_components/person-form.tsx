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
import { useCreatePerson, useUpdatePerson } from "./use-people";
import CreateNewCombobox from "@/components/create-new-combobox";
import { useQuery } from "@tanstack/react-query";
import { readAllCompanies } from "../../registrations/_utils/read-companies";
import { useCreateCompany } from "@/app/companies/_components/use-companies";
import { CompanyType } from "@/lib/enums";

const personTypeEnum = z.enum(["AUTHOR", "CONTACT_PERSON", "INTERNAL"]);

const personSchema = z.object({
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
  companyId: z.string().trim().optional().or(z.literal("")),
  type: personTypeEnum,
});

export type PersonForm = z.infer<typeof personSchema>;

export function PersonForm({
  defaultValues,
  personId,
  onSubmit,
}: {
  defaultValues: PersonForm;
  personId?: string;
  onSubmit: () => void;
}) {
  const mode = personId ? "edit" : "create";
  const { mutateAsync: createPerson, isPending: isCreating } =
    useCreatePerson();
  const { mutateAsync: updatePerson, isPending: isUpdating } =
    useUpdatePerson();
  const { mutate: createCompany } = useCreateCompany();

  const form = useForm<PersonForm>({
    resolver: zodResolver(personSchema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      phone: "",
      companyId: "",
      type: "INTERNAL",
    },
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["allCompanies"],
    queryFn: readAllCompanies,
  });

  const submitPerson = async (data: PersonForm) => {
    try {
      if (mode === "create") {
        await createPerson({
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          companyId: data.companyId || undefined,
          type: data.type,
        });
      } else {
        await updatePerson({
          id: personId!,
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          companyId: data.companyId || undefined,
          type: data.type,
        });
      }
      onSubmit();
      form.reset();
    } catch (error) {
      console.error("Error submitting person:", error);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

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
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value as PersonForm["type"])
                      }
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
                        createCompany({
                          id: value.id,
                          name: value.name,
                          type: CompanyType.CLIENT,
                        });
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
          disabled={form.formState.isSubmitting || isCreating || isUpdating}
          className="w-full cursor-pointer"
        >
          {form.formState.isSubmitting || isCreating || isUpdating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save Person"
          )}
        </Button>
      </form>
    </Form>
  );
}
