import { ChevronRight, Fan, Newspaper, Wind } from "lucide-react";
import React from "react";
import Image from "next/image";

export function StrategicPartnerships() {
  return (
    <div className="backgroundGrayGradient">
      <div className="flex w-full max-w-278 flex-col gap-11 sm:gap-16">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="h6 !font-bold text-red-900">
            Strategic Partnerships
          </div>
          <h1 className="h3 max-sm:text-[31.25px]">
            Trading partners with industry leaders
          </h1>
          <p className="h6 opacity-70">
            We supply HVAC, fire safety, and MEP equipment with fast delivery
            and commissioning support, helping contractors and integrators
            achieve reliable system performance across oil & gas, industrial,
            marine, and commercial projects.
          </p>
          <div className="inline-flex items-center gap-3 self-start rounded-4xl bg-red-900 fill-white px-4 py-2.5">
            <span className="p font-bold text-white">
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
        className={`w-10 border-2 border-t ${active ? "border-sky-500" : "border-neutral-400"}`}
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
          image="volute-logo.png"
          name="Volute"
          grayscale={true}
        />
        <DashedDivider />
        <DisplayedPartner
          image="red-shield-logo.png"
          name="Red Shield"
          grayscale={true}
        />
        <DashedDivider />
        <DisplayedPartner
          image="pitsan-logo.png"
          name="Pitsan"
          grayscale={true}
        />
        <DashedDivider />
        <DisplayedPartner
          image="gerpass-logo.png"
          name="Gerpass"
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
          className="h-auto max-h-14 object-contain"
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
          <div className="absolute inset-0 rounded-xl bg-[#00AEEF20] dark:bg-[#0078A320]"></div>
          <div className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,_#00AEEF90_0%,_#00AEEF50_30%,_#00AEEF90_60%,_#00AEEF_100%)] sm:bg-[linear-gradient(180deg,_#00AEEF90_0%,_#00AEEF20_30%,_#00AEEF10_60%,_#00AEEF_100%)] dark:bg-[linear-gradient(180deg,_#0078A390_0%,_#0078A350_30%,_#0078A390_60%,_#0078A3_100%)] dark:sm:bg-[linear-gradient(180deg,_#0078A390_0%,_#0078A320_30%,_#0078A310_60%,_#0078A3_100%)]"></div>
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
          <div className="h5 font-semibold text-white max-sm:!text-[20px]">
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
          title="Advanced Dampers"
          description="Reliable dampers for tunnels, marine, and industrial ventilation."
        />
        <PartnershipStat
          title="Air Distribution Systems"
          description="Energy-efficient solutions that improve indoor air quality."
        />
        <PartnershipStat
          title="Specialized Ventilation"
          description="Custom systems built for demanding environments."
        />
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
            <div className="h-4 -translate-x-4 border-l-1 border-sky-500 sm:h-5"></div>
            <h2 className="h6 !font-bold max-sm:text-[16px]">{title}</h2>
          </div>

          <p className="p text-neutral-500">{description}</p>
        </div>
      );
    }
  }
}
