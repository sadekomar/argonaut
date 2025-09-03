import Image from "next/image";
import {
  DraftingCompass,
  ChevronRight,
  Handshake,
  HardHat,
  ClipboardCheck,
} from "lucide-react";
import EPCMCard from "../components/EPCMCard";
import { NavBar } from "./(home)/(components)/navbar";
import { Hero } from "./(home)/(components)/hero";
import { Footer } from "./(home)/(components)/footer";
import { CTA } from "./(home)/(components)/CTA";
import { TrustedByEgyptsTopCompanies } from "./(home)/(components)/TrustedByEgyptsTopCompanies";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      
      <div>
      <div>
        <button>Hello</button>
      </div>
      <Image
        src={"/argonaut-gradient.png"}
        width={2160}
        height={1080}
        alt="Argonaut"
      />

      <div className="px-70 py-40 bg-[linear-gradient(180deg,_#F5F5F5_0%,_#FFFFFF_100%)]">
        <h1 className="text-6xl font-semibold max-w-160 mb-5">
          Full EPC Solutions for MEP Systems
        </h1>
        <div className="relative w-full">
          <Image
            src={"/epc-vent.png"}
            width={0}
            height={0}
            sizes="100vw"
            alt="Vent"
            className="w-full h-auto"
          />

          <p className="text-black text-lg font-medium absolute inset-0 max-w-115">
            Delivering Engineering, Procurement, and Construction Management{" "}
            <span className="text-[#808080]">
              for complex MEP projects across critical industries.
            </span>
          </p>
        </div>

        <div className="my-14">
          <hr className="border-t border-black opacity-10" />
          {/* left section */}
          <div className="flex flex-row">
            <div className="flex-1 py-14 pr-12">
              <h2 className="text-xl font-medium">Advanced MEP Engineering</h2>
              <p className="text-[#707070] font-medium">
                Integrated design and planning for power, HVAC, and controls
                systems
              </p>
              {/* MEP Image */}
              <Image
                src={"/mep.jpg"}
                width={0}
                height={0}
                sizes="100vw"
                alt="Advanced MEP Engineering"
                className="w-full h-auto rounded-md mt-8"
              />
            </div>
            {/* divider */}
            <div className="border-l border-black opacity-10 self-stretch"></div>
            {/* right section */}
            <div className="flex-1 py-14 pl-12 flex flex-col min-h-0">
              <h2 className="text-xl font-medium">EPCM Service Highlights</h2>
              <p className="text-[#707070] font-medium">
                Covering all stages from concept to commissioning
              </p>
              {/* EPCM cards */}
              <div className="grid grid-cols-2 gap-4 mt-8 h-full box-border">
                <EPCMCard
                  Icon={DraftingCompass}
                  title="Engineering Design & 3D Modeling"
                />
                <EPCMCard
                  Icon={Handshake}
                  title="Procurement & Vendor Management"
                />
                <EPCMCard
                  Icon={HardHat}
                  title="On-site Construction & Quality Control"
                />
                <EPCMCard
                  Icon={ClipboardCheck}
                  title="Testing & Commissioning"
                />
              </div>
            </div>
          </div>
          <hr className="border-t border-black opacity-10" />
          <h2 className="text-xl font-medium mt-14">
            How do we deliver high-performance MEP solutions?
          </h2>
          <p className="text-[#707070] font-medium">
            By integrating world-class engineering expertise with precision
            procurement and reliable construction management, ensuring every
            project meets the highest standards of efficiency, safety, and
            sustainability.
          </p>
        </div>
      </div>
      <div className="px-70 py-40 bg-[linear-gradient(180deg,_#F5F5F5_0%,_#FFFFFF_100%)]">
        <div className="flex flex-col gap-6 max-w-190 items-start">
          <div className="text-black text-lg font-medium max-w-115">
            Strategic Partnerships
          </div>
          <h1 className="text-6xl font-semibold max-w-160 mb-5">
            Innovating with Industry Leaders
          </h1>
          <p className="text-lg font-medium opacity-70">
            We work with leading global companies to deliver advanced
            engineering, procurement, and construction solutions. Together, we
            bring expertise, innovation, and sustainability to projects across
            oil & gas, defense, and infrastructure sectors.
          </p>
          <div className="inline-flex items-center gap-3 rounded-xl bg-[#811620] fill-white px-3 py-2.5 self-start">
            <span className="text-white text-lg font-medium">
              Discover Our Global Network
            </span>
            <ChevronRight className="stroke-white" />
          </div>
        </div>
      </div>
    </div>

      <TrustedByEgyptsTopCompanies />
      <CTA />
      <Footer />
    </>
  );
}
