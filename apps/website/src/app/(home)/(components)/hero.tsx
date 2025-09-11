import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden">
      <Image
        src="/argonaut-gradient.png"
        alt="Argonaut"
        fill
        priority
        className="absolute inset-0 -z-10 w-full object-cover"
      />
      <div className="z-10 flex max-w-[648px] flex-col items-center justify-center gap-6 px-4">
        <h1 className="h1 font-bold text-white">
          Trading partner & Engineering specialist
        </h1>
        <p className="max-w-2xl text-center text-xl leading-[1.5em] font-medium tracking-[-0.02em] text-white">
          We deliver full EPC solutions for complex mechanical, electrical, and
          plumbing systems (MEP), and we have proven expertise and a rich track
          record across oil and gas, defense, and infrastructure sectors.
        </p>
        <Link
          href="/services"
          className="flex h-10 items-center justify-center rounded-full bg-gray-950/70 px-4 font-bold text-white"
        >
          Discover Our Services
        </Link>
      </div>
    </div>
  );
}
