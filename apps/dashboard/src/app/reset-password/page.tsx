"use client";

import Image from "next/image";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
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
  FieldSeparator,
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
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PasswordInput,
  PasswordInputStrengthChecker,
} from "@/components/ui/password-input";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(1, { message: "New password is required" }),
});

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const resetPassword = async () => {
    if (!token) {
      form.setError("newPassword", {
        message: "Invalid or missing reset token",
      });
      return {
        data: null,
        error: { message: "Invalid or missing reset token" },
      };
    }

    const { data, error } = await authClient.resetPassword(
      {
        newPassword: form.getValues("newPassword"),
        token,
      },
      {
        onError: (response) => {
          form.setError("newPassword", { message: response.error.message });
        },
        onSuccess: () => {
          router.push("/");
        },
      }
    );

    return { data, error };
  };

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    await resetPassword();
    setIsLoading(false);
  };

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      form.setError("newPassword", {
        message: "Invalid or missing reset token",
      });
    }
  }, [token, form]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
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
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.webp" alt="Argonaut" width={20} height={20} />
          Argonaut
        </a>
        <div className="flex flex-col gap-6">
          <Suspense
            fallback={
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Reset your password</CardTitle>
                  <CardDescription>Enter your new password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                </CardContent>
              </Card>
            }
          >
            <ResetPasswordForm />
          </Suspense>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
