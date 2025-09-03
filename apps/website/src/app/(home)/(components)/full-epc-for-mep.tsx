import Image from "next/image";
import {
  DraftingCompass,
  Handshake,
  HardHat,
  ClipboardCheck,
} from "lucide-react";
import EPCMCard from "@/components/epc-card";

export function FullEPCForMEPSection() {
  return (
    <div className="bg-[linear-gradient(180deg,_#F5F5F5_0%,_#FFFFFF_100%)] px-70 py-40">
      <FullEPCForMEP />
      <div className="my-14">
        <hr className="border-t border-black opacity-10" />
        <AdvancedMEPEngineering />
        <hr className="border-t border-black opacity-10" />
        <HowWeDeliver />
      </div>
    </div>
  );
}

function HowWeDeliver() {
  return (
    <>
      <h2 className="mt-14 text-xl font-medium">
        How do we deliver high-performance MEP solutions?
      </h2>
      <p className="font-medium text-[#707070]">
        By integrating world-class engineering expertise with precision
        procurement and reliable construction management, ensuring every project
        meets the highest standards of efficiency, safety, and sustainability.
      </p>
    </>
  );
}

function AdvancedMEPEngineering() {
  return (
    <div className="flex flex-row">
      <div className="flex-1 py-14 pr-12">
        <h2 className="text-xl font-medium">Advanced MEP Engineering</h2>
        <p className="font-medium text-[#707070]">
          Integrated design and planning for power, HVAC, and controls systems
        </p>
        <Image
          src={"/mep.jpg"}
          width={0}
          height={0}
          sizes="100vw"
          alt="Advanced MEP Engineering"
          className="mt-8 h-auto w-full rounded-md"
        />
      </div>
      <div className="self-stretch border-l border-black opacity-10"></div>
      <div className="flex min-h-0 flex-1 flex-col py-14 pl-12">
        <h2 className="text-xl font-medium">EPC Service Highlights</h2>
        <p className="font-medium text-[#707070]">
          Covering all stages from concept to commissioning
        </p>
        <div className="mt-8 box-border grid h-full grid-cols-2 gap-4">
          <EPCMCard
            Icon={DraftingCompass}
            title="Engineering Design & 3D Modeling"
          />
          <EPCMCard Icon={Handshake} title="Procurement & Vendor Management" />
          <EPCMCard
            Icon={HardHat}
            title="On-site Construction & Quality Control"
          />
          <EPCMCard Icon={ClipboardCheck} title="Testing & Commissioning" />
        </div>
      </div>
    </div>
  );
}

function FullEPCForMEP() {
  return (
    <>
      <h1 className="mb-5 max-w-160 text-6xl font-semibold">
        Full EPC Solutions for MEP Systems
      </h1>
      <div className="relative w-full">
        <Image
          src={"/epc-vent.png"}
          width={0}
          height={0}
          sizes="100vw"
          alt="Vent"
          className="h-auto w-full"
        />

        <p className="absolute inset-0 max-w-115 text-lg font-medium text-black">
          Delivering Engineering, Procurement, and Construction Management{" "}
          <span className="text-[#808080]">
            for complex MEP projects across critical industries.
          </span>
        </p>
      </div>
    </>
  );
}
