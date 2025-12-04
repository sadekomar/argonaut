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
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
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
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    setIsSuccess(false);

    const { error } = await authClient.forgetPassword(
      {
        email: data.email,
        redirectTo: "/reset-password", // redirect URL after clicking the email link
      },
      {
        onError: (response) => {
          form.setError("email", { message: response.error.message });
        },
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );

    setIsLoading(false);
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.webp" alt="Argonaut" width={20} height={20} />
          Argonaut
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Forgot your password?</CardTitle>
              <CardDescription>
                {isSuccess
                  ? "Check your email for a password reset link"
                  : "Enter your email address and we'll send you a reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent a password reset link to{" "}
                    <strong>{form.getValues("email")}</strong>
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false);
                      form.reset();
                    }}
                    className="w-full"
                  >
                    Send another email
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                {...field}
                              />
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
                            "Send reset link"
                          )}
                        </Button>
                        <FieldDescription className="text-center">
                          Remember your password?{" "}
                          <Link href="/login">Sign in</Link>
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
