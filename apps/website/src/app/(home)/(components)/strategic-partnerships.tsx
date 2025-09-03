import { ChevronRight } from "lucide-react";

export function StrategicPartnerships() {
  return (
    <div className="bg-[linear-gradient(180deg,_#F5F5F5_0%,_#FFFFFF_100%)] px-70 py-40">
      <div className="flex max-w-190 flex-col items-start gap-6">
        <div className="max-w-115 text-lg font-medium text-black">
          Strategic Partnerships
        </div>
        <h1 className="mb-5 max-w-160 text-6xl font-semibold">
          Innovating with Industry Leaders
        </h1>
        <p className="text-lg font-medium opacity-70">
          We work with leading global companies to deliver advanced engineering,
          procurement, and construction solutions. Together, we bring expertise,
          innovation, and sustainability to projects across oil & gas, defense,
          and infrastructure sectors.
        </p>
        <div className="inline-flex items-center gap-3 self-start rounded-xl bg-[#811620] fill-white px-3 py-2.5">
          <span className="text-lg font-medium text-white">
            Discover Our Global Network
          </span>
          <ChevronRight className="stroke-white" />
        </div>
      </div>
    </div>
  );
}
