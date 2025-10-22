"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const runOneTap = async () => {
    await authClient.oneTap({
      callbackURL: "/dashboard",
    });
  };

  useEffect(() => {
    runOneTap();
  }, []);

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.webp" alt="Argonaut" width={20} height={20} />
          Argonaut
        </a>
        <LoginForm onSignIn={signIn} />
      </div>
    </div>
  );
}
