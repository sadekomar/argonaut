import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="justify-left relative flex min-h-[90vh] w-full items-center overflow-hidden px-20">
      <Image
        src="/argonaut-hero.png"
        alt="Argonaut"
        fill
        priority
        className="absolute inset-0 -z-10 w-full object-cover"
      />
      <div className="items-left z-10 flex max-w-[680px] flex-col justify-center gap-6 px-4">
        <h1 className="h1 font-bold text-white">
          Trading partner & Engineering specialist
        </h1>
        <p className="h6 max-w-[540px] text-left font-semibold text-white">
          We trade in and deliver full EPC solutions for MEP, HVAC and fire
          safety, backed by proven expertise and a strong track record across
          oil and gas, defense, and infrastructure sectors.
        </p>
        <Link
          href="/services"
          className="h6 flex h-[54px] w-fit items-center justify-center rounded-full bg-gray-950/70 px-8 font-bold text-white"
        >
          Discover our services
        </Link>
      </div>
    </div>
  );
}
