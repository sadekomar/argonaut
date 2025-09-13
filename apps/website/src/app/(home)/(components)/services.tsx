import Image from "next/image";
import EPCServiceHighlights from "./epc-service-highlights";

export function Services() {
  return (
    <div id="full-epc-section" className="backgroundGrayGradient">
      <div className="max-w-278">
        <ServicesForEPC />
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
      <h2 className="base:mt-14 h6 mt-10 font-medium max-sm:!text-base">
        How do we deliver high-performance MEP solutions?
      </h2>
      <p className="p font-medium text-neutral-500 max-sm:!text-sm">
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
      <LeftSection />
      <hr className="mt-10 border-t border-black opacity-10 dark:border-white" />
      <div className="base:block hidden self-stretch border-l border-black opacity-10 dark:border-white"></div>
      <RightSection />
    </div>
  );

  function RightSection() {
    return (
      <div className="base:my-14 base:ml-12 my-10 flex min-h-0 flex-3 flex-col">
        <h2 className="h6 font-medium max-sm:!text-base">
          EPC Service Highlights
        </h2>
        <p className="p font-medium text-neutral-500 max-sm:!text-sm">
          Covering all stages from concept to commissioning
        </p>
        <EPCServiceHighlights />
      </div>
    );
  }

  function LeftSection() {
    return (
      <div className="base:my-14 base:mr-12 mt-10 flex min-h-0 flex-2 flex-col">
        <h2 className="h6 font-medium max-sm:!text-base">
          Comprehensive MEP Solutions Across Industries
        </h2>
        <p className="p font-medium text-neutral-500 max-sm:!text-sm">
          Delivering integrated EPC, HVAC and fire safety for oil & gas,
          industrial, marine, and commercial sectors.
        </p>
        <Image
          src={"/3.jpg"}
          width={0}
          height={0}
          sizes="100vw"
          alt="Advanced MEP Engineering"
          className="base:h-full mt-8 box-border h-75 w-full rounded-md object-cover"
        />
      </div>
    );
  }
}

function ServicesForEPC() {
  return (
    <>
      <h1 className="h3 base:mb-2 h3 mb-1.4 font-semibold max-sm:!text-[31.25px]">
        Services for EPC, HVAC, and Fire Safety
      </h1>
      <div className="base:mb-14 mb-10 flex w-full flex-col">
        <p className="h6 base:mb-8 mb-5.5 text-black max-sm:!text-base dark:text-white">
          Delivering Engineering, Procurement, and Construction Management{" "}
          <span className="text-zinc-500 dark:sm:text-zinc-400">
            for complex MEP, HVAC, and Fire systems across critical industries.
          </span>
        </p>
        <div className="mask-[radial-gradient(circle_at_right,black_80%,transparent_100%)]">
          <div className="mask-[radial-gradient(circle_at_top_right,transparent_1%,black_50%)]">
            <Image
              src={"/8.png"}
              width={0}
              height={0}
              sizes="100vw"
              alt="Tunnel Ventilation System"
              className="base:h-87 h-60 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
