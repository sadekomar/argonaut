import { useReadCompanies } from "@/app/companies/_components/use-companies";
import { useReadPeople } from "@/app/people/_components/use-people";
import { createPerson } from "@/app/people/_utils/create-person";
import { useReadProjects } from "@/app/projects/_components/use-projects";
import CreateNewCombobox from "@/components/create-new-combobox";
import { mapToSelectOptions } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MaskInput } from "@/components/ui/mask-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyType, Currency, PersonType } from "@repo/db";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createCompany } from "@/app/companies/_utils/create-company";
import { createProject } from "@/app/projects/_utils/create-project";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const rfqFormSchema = z.object({
  referenceNumber: z.string(),
  date: z.string(),
  currency: z.enum(Currency),
  value: z.string(),
  notes: z.string(),
  authorId: z.string(),
  supplierId: z.string(),
  clientId: z.string(),
  projectId: z.string(),
  rfqReceivedAt: z.string(),
  quoteId: z.string(),
});

type rfqFormInput = z.infer<typeof rfqFormSchema>;

function RfqForm({
  rfqId,
  defaultValues,
  onSubmit,
}: {
  rfqId: string;
  defaultValues: rfqFormInput;
  onSubmit: () => void;
}) {
  const mode = rfqId ? "edit" : "add";

  const [currentCurrency, setCurrentCurrency] = useState("EGP");

  // fetch data needed for form
  const { data: projects } = useReadProjects();
  const { data: authors } = useReadPeople({
    type: [PersonType.AUTHOR],
  });
  const { data: clients } = useReadCompanies({
    type: [CompanyType.CLIENT],
  });
  const { data: suppliers } = useReadCompanies({
    type: [CompanyType.SUPPLIER],
  });
  const projectsInitialOptions = mapToSelectOptions(projects?.data);
  const authorsInitialOptions = mapToSelectOptions(authors?.data);
  const clientsInitialOptions = mapToSelectOptions(clients?.data);
  const suppliersInitialOptions = mapToSelectOptions(suppliers?.data);

  const form = useForm({
    defaultValues: defaultValues ?? {
      referenceNumber: "",
      date: "",
      currency: "",
      value: "",
      notes: "",
      authorId: "",
      supplierId: "",
      clientId: "",
      projectId: "",
      rfqReceivedAt: "",
      quoteId: "",
    },
  });

  const submitRfq = () => {
    // hello world
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitRfq)} className="space-y-6">
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
