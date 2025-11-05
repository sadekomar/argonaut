"use client";

import { cn } from "@/lib/utils";
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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  PasswordInput,
  PasswordInputStrengthChecker,
} from "./ui/password-input";
import { LoadingSwap } from "./ui/loading-swap";

const signupSchema = z.object({
  name: z.string().trim().min(1, { message: "Full name is required" }),
  email: z.string().trim().min(1, { message: "Email is required" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email({
      name: form.getValues("name"),
      email: form.getValues("email"),
      password: form.getValues("password"),
      callbackURL: "/",
    });

    return { data, error };
  };

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    const { data: signUpData, error: signUpError } = await signUp();
    if (signUpError) {
      form.setError("email", { message: signUpError.message });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} required />
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
                        <Input type="email" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field}>
                          <PasswordInputStrengthChecker />
                        </PasswordInput>
                        {/* <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeIcon className="h-4 w-4" />
                            ) : (
                              <EyeOffIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Field>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer"
                  >
                    <LoadingSwap isLoading={isSubmitting}>
                      {" "}
                      Create Account{" "}
                    </LoadingSwap>
                    {/* {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Create Account"
                    )} */}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
