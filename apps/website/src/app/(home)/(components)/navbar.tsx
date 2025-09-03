import Image from "next/image";
import Link from "next/link";

export function NavBar() {
  return (
    <nav className="fixed inset-x-0 top-4 mx-auto flex h-16 w-[1080px] items-center justify-between rounded-full bg-gray-500/10 px-4 py-4 font-bold tracking-[-0.03em] backdrop-blur-xl">
      <Link
        href="/"
        className="flex h-10 items-center justify-center rounded-full bg-white px-4"
      >
        <Image
          src={"/argonaut-white-horizontal.png"}
          width={128}
          height={28}
          alt="Argonaut"
        />
      </Link>
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <Link href="/previous-projects">Previous Projects</Link>
        <Link href="/quality-policy">Quality Policy</Link>
        <Link href="/about">About</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/get-quote"
          className="flex h-10 items-center justify-center rounded-full bg-white px-4"
        >
          Get a Quote
        </Link>
        <Link
          href="/become-supplier"
          className="flex h-10 items-center justify-center rounded-full bg-gray-500/20 px-4"
        >
          Become a Supplier
        </Link>
      </div>
    </nav>
  );
}
