import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { headers } from "next/headers";

export default async function LoginPage() {
  const headersList = await headers();
  const host = headersList.get("host");
  const isAlunaut = host === "crm.alunaut.com.eg";

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          {isAlunaut ? (
            <>
              <Image
                src="/alunaut.png"
                alt="Alunaut"
                width={20}
                height={20}
                className="h-5 w-auto object-contain"
              />
              Alunaut
            </>
          ) : (
            <>
              <Image src="/logo.webp" alt="Argonaut" width={20} height={20} />
              Argonaut
            </>
          )}
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
