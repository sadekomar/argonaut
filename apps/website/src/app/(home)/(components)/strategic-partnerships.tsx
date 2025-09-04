import { ChevronRight, Fan, Newspaper, Wind } from "lucide-react";
import React from "react";
import Image from "next/image";

export function StrategicPartnerships() {
  return (
    <div className="flex flex-col gap-24 bg-[linear-gradient(180deg,_#F5F5F5_0%,_#FFFFFF_100%)] px-50 py-40">
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
      <div className="flex flex-row gap-8">
        <PartnershipStats />
        <PartnerLearnMore />
      </div>

      <div className="custom-dashed-border-top flex flex-row justify-around">
        <DisplayedPartner image="halton-logo.png" name="Halton" />
        <DashedDivider />
        <DisplayedPartner
          image="trane-logo.png"
          name="Trane"
          grayscale={true}
        />
        <DashedDivider />
        <DisplayedPartner
          image="enposs-logo.png"
          name="Enposs"
          grayscale={true}
        />
        <DashedDivider />
        <DisplayedPartner
          image="volute-logo.svg"
          name="Volute"
          grayscale={true}
        />
        <DashedDivider />
        <DisplayedPartner
          image="pitsan-logo.png"
          name="Pitsan"
          grayscale={true}
        />
      </div>
    </div>
  );

  function DisplayedPartner({
    image,
    name,
    grayscale,
  }: {
    image: string;
    name: string;
    grayscale?: boolean;
  }) {
    return (
      <div
        className={`flex items-center px-8.75 pt-8 pb-4 ${grayscale ? "grayscale" : ""}`}
      >
        <Image
          width={130}
          height={0}
          src={`/partners/${image}`}
          alt={`${name}'s Logo`}
          className="h-auto"
        />
      </div>
    );
  }

  function DashedDivider() {
    return <div className="custom-dashed-border-right"></div>;
  }

  function PartnerLearnMore() {
    return (
      <div className="relative w-full drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)]">
        <div className="relative">
          <Image
            width={0}
            height={0}
            src="/halton-building.webp"
            alt="Halton's Building"
            className="h-auto w-full rounded-xl"
            sizes="100vw"
          />
          <div className="absolute inset-0 rounded-xl bg-[#00AEEF20]"></div>
          <div className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,_#00AEEF90_0%,_#00AEEF20_30%,_#00AEEF10_60%,_#00AEEF_100%)]"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between px-6 py-6">
          <div className="flex flex-row justify-between">
            <Image
              width={150}
              height={0}
              src="/partners/halton-logo.png"
              alt="halton's logo"
              className="h-auto brightness-[500%] grayscale"
            />
            <Newspaper className="h-10 w-10 stroke-white" />
          </div>
          <div className="text-2xl font-semibold text-white">
            Learn how Halton powers sustainable indoor air solutions for our
            projects
          </div>
        </div>
      </div>
    );
  }

  function PartnershipStats() {
    return (
      <div className="flex flex-col justify-around">
        <PartnershipStat
          title="50+ Years"
          description="Halton powers clean air in 35+ countries with 50 years of innovation in demanding environments."
        />
        <PartnershipStat
          title="35+ Countries"
          description="Global locations delivering advanced indoor air solutions."
        />
        <div>
          <div className="flex flex-row items-center">
            <div className="h-5 -translate-x-4 border-l-1 border-[#00AEEF]"></div>
            <div className="text-2xl font-medium">Solutions provided</div>
          </div>
          <div className="flex flex-row gap-2.5">
            <Wind className="h-6 w-6" />
            <div className="text-base font-light">Ventilation Systems</div>
          </div>
          <div className="flex flex-row gap-2.5">
            <Fan className="h-6 w-6" />
            <div className="text-base font-light">
              Air Distribution Technologies
            </div>
          </div>
        </div>
      </div>
    );

    function PartnershipStat({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) {
      return (
        <div>
          <div className="flex flex-row items-center">
            <div className="h-5 -translate-x-4 border-l-1 border-[#00AEEF]"></div>
            <div className="text-2xl font-medium">{title}</div>
          </div>

          <div className="text-base font-light">{description}</div>
        </div>
      );
    }
  }
}
