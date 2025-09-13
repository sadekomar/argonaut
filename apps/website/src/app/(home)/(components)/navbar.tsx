"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Fragment, useState } from "react";

const pages = [
  {
    name: "Home",
    slug: "/",
  },
  {
    name: "Quality Policy",
    slug: "/quality-policy",
  },
  {
    name: "About",
    slug: "/about",
  },
];

export function NavBar() {
  return (
    <>
      <DesktopNavBar />
      <MobileNav />
    </>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-[56px] items-center justify-between bg-gray-100/80 px-10 backdrop-blur-xl md:hidden">
      <Link
        href="/"
        className="flex h-10 items-center justify-center rounded-full bg-white px-4"
      >
        <Image
          src={"/argonaut-horizontal-small.webp"}
          width={128}
          height={28}
          alt="Argonaut"
          className="h-12 object-contain"
        />
      </Link>
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="h-10 w-10 p-0">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <SheetTitle className="sr-only">Hamburger Menu</SheetTitle>
            <nav className="mt-8 flex flex-col">
              {pages.map((page, index) => (
                <Fragment key={index}>
                  <Link
                    key={index}
                    href={page.slug}
                    className="text-foreground hover:bg-accent hover:text-accent-foreground block px-2 py-4 text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {page.name}
                  </Link>
                </Fragment>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function DesktopNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-4 z-50 mx-auto hidden h-16 w-fit max-w-[1080px] items-center justify-between gap-8 rounded-full bg-gray-500/10 px-4 font-bold tracking-[-0.03em] backdrop-blur-xl md:flex">
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
