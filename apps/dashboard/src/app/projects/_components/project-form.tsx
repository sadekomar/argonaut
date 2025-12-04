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
import { useEffect } from "react";
import CreateNewCombobox from "@/components/create-new-combobox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readAllCompanies } from "../../registrations/_utils/read-companies";
import { createClient } from "../../quotes/_utils/create-supplier";
import { useCreateProject, useEditProject, useGetProjects } from "./use-projects";

const projectStatusEnum = z.enum(["IN_HAND", "TENDER"]);

const projectFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  status: projectStatusEnum.optional().nullable(),
  companyId: z.string().trim().optional().nullable(),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  // default values could be passed in create mode too. for example, loading initial data from local storage.
  defaultValues?: ProjectForm;
  projectId?: string;
  onSubmit: (data: ProjectForm) => void;
}

export function ProjectForm({
  defaultValues,
  projectId,
  onSubmit,
}: ProjectFormProps) {
  const mode = projectId ? "edit" : "add";
  const createProject = useCreateProject();
  const updateProject = useEditProject();
  const queryClient = useQueryClient();

  // Fetch project data if in edit mode and defaultValues not provided
  const { data: projectsData } = useGetProjects(
    mode === "edit" && !defaultValues ? { perPage: 1000 } : undefined
  );
  const project =
    mode === "edit" && !defaultValues
      ? projectsData?.data.find((p) => p.id === projectId)
      : null;

  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      status: undefined,
      companyId: "",
    },
  });

  // Pre-populate form when project data is loaded (if defaultValues not provided)
  useEffect(() => {
    if (project && !defaultValues) {
      form.reset({
        name: project.name,
        status: project.status || null,
        companyId: project.companyId || null,
      });
    }
  }, [project, defaultValues, form]);

  const submitProject = async (data: ProjectForm) => {
    try {
      onSubmit(data);
      if (mode === "add") {
        await createProject.mutateAsync({
          name: data.name,
          status: data.status || undefined,
          companyId: data.companyId || undefined,
        });
      } else {
        await updateProject.mutateAsync({
          id: projectId!,
          name: data.name,
          status: data.status,
          companyId: data.companyId,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectsMetadata"] });
      form.reset();
    } catch (e) {
      console.error("Error submitting project:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

  const { data: companies = [] } = useQuery({
    queryKey: ["allCompanies"],
    queryFn: readAllCompanies,
  });

  // Show loading state only if in edit mode and project data is being fetched
  if (mode === "edit" && !defaultValues && !project) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitProject)}
        className="space-y-6"
      >
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? (e.target.value as "IN_HAND" | "TENDER")
                            : null
                        )
                      }
                    >
                      <option value="">Select status (optional)</option>
                      <option value="IN_HAND">In Hand</option>
                      <option value="TENDER">Tender</option>
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
                  <FormLabel>Company (Optional)</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={companies}
                      createNewFunction={async (value) => {
                        const company = await createClient(value);
                        return company.id;
                      }}
                      label="company"
                      value={field.value ?? ""}
                      onValueChange={(value) =>
                        field.onChange(value || null)
                      }
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
          ) : mode === "add" ? (
            "Save Project"
          ) : (
            "Update Project"
          )}
        </Button>
      </form>
    </Form>
  );
}

