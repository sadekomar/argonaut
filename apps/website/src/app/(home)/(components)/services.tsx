import Image from "next/image";
import EPCServiceHighlights from "./epc-service-highlights";

export function Services() {
  return (
    <div className="backgroundGrayGradient">
      <div className="max-w-300">
        <FullEPCForMEP />
        <div>
          <hr className="border-t border-black opacity-10 dark:border-white" />
          <AdvancedMEPEngineering />
          <hr className="border-t border-black opacity-10 dark:border-white" />
          <HowWeDeliver />
        </div>
      </div>
    </div>
  );
}

function HowWeDeliver() {
  return (
    <>
      <h2 className="base:mt-14 heading2 mt-10">
        How do we deliver high-performance MEP solutions?
      </h2>
      <p className="description2 text-neutral-500">
        By integrating world-class engineering expertise with precision
        procurement and reliable construction management, ensuring every project
        meets the highest standards of efficiency, safety, and sustainability.
      </p>
    </>
  );
}

function AdvancedMEPEngineering() {
  return (
    <div className="base:flex-row flex flex-col">
      <div className="base:my-14 base:mr-12 mt-10 flex min-h-0 flex-1 flex-col">
        <h2 className="heading2">Advanced MEP Engineering</h2>
        <p className="description2 text-neutral-500">
          Integrated design and planning for power, HVAC, and controls systems
        </p>
        <Image
          src={"/mep.jpg"}
          width={0}
          height={0}
          sizes="100vw"
          alt="Advanced MEP Engineering"
          className="base:h-full mt-8 box-border h-75 w-full rounded-md object-cover"
        />
      </div>
      <hr className="mt-10 border-t border-black opacity-10 dark:border-white" />
      <div className="base:block hidden self-stretch border-l border-black opacity-10 dark:border-white"></div>
      <div className="base:my-14 base:ml-12 my-10 flex min-h-0 flex-1 flex-col">
        <h2 className="heading2">EPC Service Highlights</h2>
        <p className="description2 text-neutral-500">
          Covering all stages from concept to commissioning
        </p>
        <EPCServiceHighlights />
      </div>
    </div>
  );
}

function FullEPCForMEP() {
  return (
    <>
      <h1 className="h3 base:mb-5 mb-3.5 max-sm:text-[31.25px]">
        Full EPC Solutions for MEP Systems
      </h1>
      <div className="base:mb-14 relative mb-10 flex w-full flex-col">
        <p className="description1 base:!max-w-135 z-50 text-black sm:absolute sm:inset-0 sm:max-w-85 dark:text-white">
          Delivering Engineering, Procurement, and Construction Management{" "}
          <span className="text-zinc-500 dark:sm:text-zinc-400">
            for complex MEP projects across critical industries.
          </span>
        </p>
        <div className="mask-[radial-gradient(circle_at_right,black_0%,transparent_100%)]">
          <div className="mask-[radial-gradient(circle_at_top_right,transparent_1%,black_50%)]">
            <Image
              src={"/epc-vent1.jpg"}
              width={0}
              height={0}
              sizes="100vw"
              alt="Vent Image"
              className="base:h-87 h-60 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
