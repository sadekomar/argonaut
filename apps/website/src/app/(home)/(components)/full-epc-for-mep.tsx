import Image from "next/image";
import {
  DraftingCompass,
  Handshake,
  HardHat,
  ClipboardCheck,
} from "lucide-react";
import EPCCard from "@/components/epc-card";

export function FullEPCForMEPSection() {
  return (
    <div className="backgroundGrayGradient">
      <div className="max-w-300">
        <FullEPCForMEP />
        <div>
          <hr className="border-t border-black opacity-10" />
          <AdvancedMEPEngineering />
          <hr className="border-t border-black opacity-10" />
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
      <p className="description2 text-[#707070]">
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
        <p className="description2 text-[#707070]">
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
      <hr className="mt-10 border-t border-black opacity-10" />
      <div className="base:block hidden self-stretch border-l border-black opacity-10"></div>
      <div className="base:my-14 base:ml-12 my-10 flex min-h-0 flex-1 flex-col">
        <h2 className="heading2">EPC Service Highlights</h2>
        <p className="description2 text-[#707070]">
          Covering all stages from concept to commissioning
        </p>
        <div className="mt-8 box-border grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
          <EPCCard
            Icon={DraftingCompass}
            title="Engineering Design & 3D Modeling"
          />
          <EPCCard Icon={Handshake} title="Procurement & Vendor Management" />
          <EPCCard
            Icon={HardHat}
            title="On-site Construction & Quality Control"
          />
          <EPCCard Icon={ClipboardCheck} title="Testing & Commissioning" />
        </div>
      </div>
    </div>
  );
}

function FullEPCForMEP() {
  return (
    <>
      <h1 className="heading1 base:mb-5 mb-3.5">
        Full EPC Solutions for MEP Systems
      </h1>
      <div className="relative flex w-full flex-col">
        <p className="description1 base:!max-w-135 text-black sm:absolute sm:inset-0 sm:max-w-85">
          Delivering Engineering, Procurement, and Construction Management{" "}
          <span className="text-[#808080]">
            for complex MEP projects across critical industries.
          </span>
        </p>
        <Image
          src={"/epc-vent.png"}
          width={0}
          height={0}
          sizes="100vw"
          alt="Vent"
          className="base:h-87 h-60 w-full object-cover"
        />
      </div>
    </>
  );
}
