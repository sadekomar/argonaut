"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readQuotes } from "../_utils/read-quotes";
import { readAuthors } from "../../quotes/_utils/read-suppliers";
import { createAuthor } from "@/app/people/_utils/create-person";
import { createFollowUp } from "../_utils/create-follow-up";

const addFollowUpSchema = z.object({
  quoteId: z.string().trim().min(1, { message: "Quote is required" }),
  authorId: z.string().trim().min(1, { message: "Author is required" }),
  notes: z.string().trim().optional(),
});

export type AddFollowUpForm = z.infer<typeof addFollowUpSchema>;

export function AddFollowUpForm() {
  const queryClient = useQueryClient();

  const form = useForm<AddFollowUpForm>({
    resolver: zodResolver(addFollowUpSchema),
    defaultValues: {
      quoteId: "",
      authorId: "",
      notes: "",
    },
  });

  const submitFollowUp = async (data: AddFollowUpForm) => {
    try {
      await createFollowUp({
        quoteId: data.quoteId,
        authorId: data.authorId,
        notes: data.notes || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["followUps"] });
      queryClient.invalidateQueries({ queryKey: ["followUpsMetadata"] });
      form.reset();
    } catch (e) {
      console.error("Error submitting follow-up:", e);
      form.setError("root", {
        message: "Failed to submit. Please try again.",
      });
    }
  };

  const { data: quotes = [] } = useQuery({
    queryKey: ["quotes"],
    queryFn: readQuotes,
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: readAuthors,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitFollowUp)} className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="quoteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote</FormLabel>
                  <FormControl>
                    <CreateNewCombobox
                      initialOptions={quotes}
                      createNewFunction={async () => {
                        // Quotes should already exist, so we don't create new ones
                        throw new Error("Quote must already exist");
                      }}
                      label="quote"
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

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save Follow-Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
