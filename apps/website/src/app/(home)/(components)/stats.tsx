import React from "react";
import Image from "next/image";
import StatsGrid from "../../../components/stats-fade";
import CountUp from "@/components/count-up";

export function Stats() {
  return (
    <div className="backgroundGrayGradient">
      <div className="base:grid-cols-2 base:justify-between base:[&>*:nth-child(even)]:justify-self-end max-base:[&>*:not(:first-child)]:justify-self-center grid w-full max-w-300 grid-cols-1 gap-11 sm:gap-16 [&>*:nth-child(n+3)]:max-h-57">
        <SectionHeading />
        <BigStat />
        <Graph />
        <StatsGrid />
      </div>
    </div>
  );

  function SectionHeading() {
    return (
      <h1 className="h3 !max-w-150 max-sm:text-[31.25px]">
        Proven Track Record of Excellence
      </h1>
    );
  }

  function BigStat() {
    return (
      <div className="base:min-w-103 flex flex-col">
        <CountUp
          to={100}
          duration={0.5}
          suffix="%"
          className="heading1 !text-9xl xl:!text-[160px]"
        />
        <div className="description1">Client Satisfaction</div>
      </div>
    );
  }

  function Graph() {
    return (
      <Image
        width={0}
        height={0}
        src="/chart.png"
        alt="asd"
        className="h-auto w-full object-contain"
        sizes="100vw"
      />
    );
  }
}
