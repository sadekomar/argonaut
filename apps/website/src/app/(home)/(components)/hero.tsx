"use client";

import Image from "next/image";

export function Hero() {
  return (
    <div className="justify-left relative flex min-h-[90vh] w-full items-center overflow-hidden px-20">
      <Image
        src="/argonaut-hero.webp"
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
        <button
          onClick={() => {
            document.getElementById("full-epc-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="h6 flex h-[54px] w-fit cursor-pointer items-center justify-center rounded-full bg-gray-950/70 px-8 font-bold text-white transition-colors hover:bg-gray-950/80"
        >
          Discover our services
        </button>
      </div>
    </div>
  );
}
