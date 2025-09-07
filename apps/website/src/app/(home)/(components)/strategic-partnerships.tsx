import { ChevronRight, Fan, Newspaper, Wind } from "lucide-react";
import React from "react";
import Image from "next/image";

export function StrategicPartnerships() {
  return (
    <div className="backgroundGrayGradient">
      <div className="flex w-full max-w-300 flex-col gap-11 sm:gap-16">
        <div className="flex max-w-190 flex-col items-start gap-4 sm:gap-6">
          <div className="description1 max-w-115 !font-bold text-[#811620]">
            Strategic Partnerships
          </div>
          <h1 className="heading1">Innovating with Industry Leaders</h1>
          <p className="description1 opacity-70">
            We work with leading global companies to deliver advanced
            engineering, procurement, and construction solutions. Together, we
            bring expertise, innovation, and sustainability to projects across
            oil & gas, defense, and infrastructure sectors.
          </p>
          <div className="inline-flex items-center gap-3 self-start rounded-4xl bg-[#811620] fill-white px-3 py-2.5">
            <span className="description2 text-white">
              Discover Our Global Network
            </span>
            <ChevronRight className="h-4 w-4 stroke-white" />
          </div>
        </div>
        <div className="base:flex-row flex flex-col gap-8">
          <PartnershipStats />
          <PartnerLearnMore />
          <div className="base:hidden flex flex-row justify-center gap-2">
            <PartnerHorizontalLine active={true} />
            <PartnerHorizontalLine active={false} />
            <PartnerHorizontalLine active={false} />
            <PartnerHorizontalLine active={false} />
            <PartnerHorizontalLine active={false} />
          </div>
        </div>

        <div className="base:block hidden">
          <PartnersRow />
        </div>
      </div>
    </div>
  );

  function PartnerHorizontalLine({ active }: { active: boolean }) {
    return (
      <hr
        className={`w-10 border-2 border-t ${active ? "border-[#00AEEF]" : "border-neutral-400"}`}
      />
    );
  }

  function PartnersRow() {
    return (
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
    );
  }

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
            className="h-auto max-h-105 w-full rounded-xl object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 rounded-xl bg-[#00AEEF20]"></div>
          <div className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,_#00AEEF90_0%,_#00AEEF50_30%,_#00AEEF90_60%,_#00AEEF_100%)] sm:bg-[linear-gradient(180deg,_#00AEEF90_0%,_#00AEEF20_30%,_#00AEEF10_60%,_#00AEEF_100%)]"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
          <div className="flex flex-row justify-between">
            <Image
              width={100}
              height={0}
              src="/partners/halton-logo.png"
              alt="halton's logo"
              className="h-auto brightness-[500%] grayscale sm:w-37.5"
            />
            <Newspaper className="h-6 w-6 stroke-white sm:h-10 sm:w-10" />
          </div>
          <div className="text-lg font-semibold text-white sm:text-2xl">
            Learn how Halton powers sustainable indoor air solutions for our
            projects
          </div>
        </div>
      </div>
    );
  }

  function PartnershipStats() {
    return (
      <div className="base:!flex base:!justify-around base:!flex-col base:max-w-62 base:!gap-y-0 flex flex-col justify-around gap-8 sm:grid sm:grid-cols-2 sm:gap-12 sm:gap-x-12 sm:gap-y-4">
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
            <div className="h-4 -translate-x-4 border-l-1 border-[#00AEEF] sm:h-5"></div>
            <h2 className="heading2 !font-bold">Solutions provided</h2>
          </div>
          <div className="flex flex-row items-center gap-2.5">
            <Wind className="h-4 w-4 stroke-[#707070]" />
            <div className="description2 text-[#707070]">
              Ventilation Systems
            </div>
          </div>
          <div className="flex flex-row items-center gap-2.5">
            <Fan className="h-4 w-4 stroke-[#707070]" />
            <div className="description2 text-[#707070]">
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
        <div className="max-base:flex-1/3">
          <div className="flex flex-row items-center">
            <div className="h-4 -translate-x-4 border-l-1 border-[#00AEEF] sm:h-5"></div>
            <h2 className="heading2 !font-bold">{title}</h2>
          </div>

          <p className="description2 text-[#707070]">{description}</p>
        </div>
      );
    }
  }
}
