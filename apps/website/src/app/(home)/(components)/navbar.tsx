"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-4 z-50 mx-auto flex h-16 w-fit max-w-[1080px] items-center justify-between gap-8 rounded-full bg-gray-500/10 px-4 font-bold tracking-[-0.03em] backdrop-blur-xl">
      <Link
        href="/"
        className="flex h-10 items-center justify-center rounded-full bg-white px-4"
      >
        <Image
          src={"/argonaut-horizontal-small.webp"}
          width={128}
          height={28}
          alt="Argonaut"
          className="h-auto w-full object-contain grayscale filter transition duration-200 hover:grayscale-0"
        />
      </Link>
      <div className="flex h-full items-center gap-4">
        <Link
          href="/"
          className={
            pathname === "/"
              ? "flex h-10 items-center rounded-full bg-gray-500/10 px-4 backdrop-blur-xl"
              : ""
          }
        >
          Home
        </Link>
        {/* <Link href="/services">Services</Link>
        <Link href="/previous-projects">Previous Projects</Link> */}
        <Link
          href="/quality-policy"
          className={
            pathname === "/quality-policy"
              ? "flex h-10 items-center rounded-full bg-gray-500/10 px-4 backdrop-blur-xl"
              : ""
          }
        >
          Quality Policy
        </Link>
        <Link
          href="/about"
          className={
            pathname === "/about"
              ? "flex h-10 items-center rounded-full bg-gray-500/10 px-4 backdrop-blur-xl"
              : ""
          }
        >
          About
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="https://www.linkedin.com/company/argonaut-egypt/"
          className="flex h-10 items-center justify-center rounded-full bg-white px-4"
        >
          Get a Quote
        </Link>
        <Link
          href="https://www.linkedin.com/company/argonaut-egypt/"
          className="flex h-10 items-center justify-center rounded-full bg-gray-500/20 px-4"
        >
          Become a Supplier
        </Link>
      </div>
    </nav>
  );
}
