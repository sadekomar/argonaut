"use client";
import { useEffect, useRef, useState } from "react";

export default function StatsGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid grid-cols-2 content-between max-sm:gap-5 sm:min-w-103 ${
        isVisible
          ? "[&>*:nth-child(1)]:animate-[fadeInUp_0.6s_ease-out_0.2s_both] [&>*:nth-child(2)]:animate-[fadeInUp_0.6s_ease-out_0.4s_both] [&>*:nth-child(3)]:animate-[fadeInUp_0.6s_ease-out_0.6s_both] [&>*:nth-child(4)]:animate-[fadeInUp_0.6s_ease-out_0.8s_both]"
          : "[&>*]:translate-y-[30px] [&>*]:opacity-0"
      }`}
    >
      <SmallStat number="250+" label="Projects" />
      <SmallStat number="44+" label="Clients" />
      <SmallStat number="3+" label="Suppliers" />
      <SmallStat number="10+" label="Years of Experience" />
    </div>
  );

  function SmallStat({ number, label }: { number: string; label: string }) {
    return (
      <div className="flex flex-col">
        <h2 className="text-6xl font-semibold">{number}</h2>
        <div className="h6 max-sm:!text-base">{label}</div>
      </div>
    );
  }
}
