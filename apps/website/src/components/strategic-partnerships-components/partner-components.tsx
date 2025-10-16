import React from "react";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { type PartnerData } from "@/data/partners";

interface PartnerHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

export function PartnerHeader({
  title,
  subtitle,
  description,
}: PartnerHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 sm:gap-6">
      <div className="h6 font-bold text-red-900">{title}</div>
      <h1 className="h3 font-semibold max-sm:!text-[31.25px]">{subtitle}</h1>
      <p className="h6 font-medium opacity-70">{description}</p>
    </div>
  );
}

interface PartnerBackgroundProps {
  partnerData: PartnerData[];
  activeIndex: number;
}

export function PartnerBackground({
  partnerData,
  activeIndex,
}: PartnerBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10">
      {partnerData.map((partner, index) => (
        <div
          key={`bg-${partner.name}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === activeIndex
              ? "z-[3] opacity-100"
              : `opacity-0 ${index < activeIndex ? "z-[2]" : "z-[1]"}`
          }`}
        >
          <Image
            width={0}
            height={0}
            src={partner.backgroundImagePath}
            alt={`${partner.name} background`}
            className="h-full w-full rounded-xl object-cover"
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

interface PartnerIndicatorsProps {
  partnerData: PartnerData[];
  activePartner: string;
}

export function PartnerIndicators({
  partnerData,
  activePartner,
}: PartnerIndicatorsProps) {
  return (
    <div className="base:hidden mt-4 flex flex-row justify-center gap-2">
      {partnerData.map((partner, index) => (
        <PartnerHorizontalLine
          key={`indicator-${partner.name}`}
          active={partner.name === activePartner}
          gradientColor={
            partner.name === activePartner ? partner.gradientColor : undefined
          }
        />
      ))}
    </div>
  );
}

interface PartnerCarouselTrackProps {
  partnerData: PartnerData[];
  trackRef: React.RefObject<HTMLDivElement | null>;
}

export function PartnerCarouselTrack({
  partnerData,
  trackRef,
}: PartnerCarouselTrackProps) {
  return (
    <div className="">
      <div
        ref={trackRef}
        className="flex min-h-[410px] w-full touch-pan-x snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {partnerData.map((partner) => (
          <article
            key={partner.name}
            className="w-full shrink-0 snap-center"
            data-brand-color={partner.gradientColor}
          >
            <PartnerSlideContent partner={partner} />
          </article>
        ))}
      </div>
    </div>
  );
}

export function PartnerSlideContent({ partner }: { partner: PartnerData }) {
  return (
    <div className="base:flex-row flex h-full flex-col justify-between gap-8 p-6">
      <PartnershipStats
        stat1={partner.stat1}
        stat2={partner.stat2}
        stat3={partner.stat3}
        description1={partner.description1}
        description2={partner.description2}
        description3={partner.description3}
        gradientColor={partner.gradientColor}
      />
      <PartnerLearnMore
        backgroundImagePath={partner.backgroundImagePath}
        logoPath={partner.logoPath}
        imageText={partner.imageText}
        gradientColor={partner.gradientColor}
      />
    </div>
  );
}

export function PartnerHorizontalLine({
  active,
  gradientColor,
}: {
  active: boolean;
  gradientColor?: string;
}) {
  return (
    <hr
      className={`w-10 border-2 border-t transition-colors duration-300 ${active ? "" : "border-neutral-400"}`}
      style={
        active && gradientColor ? { borderColor: `#${gradientColor}` } : {}
      }
    />
  );
}

export function PartnerLearnMore({
  backgroundImagePath,
  logoPath,
  imageText,
  gradientColor,
}: {
  backgroundImagePath: string;
  logoPath: string;
  imageText: string;
  gradientColor: string;
}) {
  return (
    <div className="relative w-full">
      <div className="relative drop-shadow-[0_14px_4px_rgba(0,0,0,0.3)]">
        <Image
          width={0}
          height={0}
          src={backgroundImagePath}
          alt="Partner Building"
          className="base:!min-h-105 base:!max-h-105 h-auto max-h-90 min-h-90 w-full rounded-xl object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 rounded-xl opacity-20"
          style={{ backgroundColor: `#${gradientColor}` }}
        />
        <div
          className="absolute inset-0 rounded-xl sm:hidden"
          style={{
            background: `linear-gradient(180deg, #${gradientColor}90 0%, #${gradientColor}50 30%, #${gradientColor}90 60%, #${gradientColor} 100%)`,
          }}
        />
        <div
          className="absolute inset-0 hidden rounded-xl sm:block"
          style={{
            background: `linear-gradient(180deg, #${gradientColor}90 0%, #${gradientColor}20 30%, #${gradientColor}10 60%, #${gradientColor} 100%)`,
          }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-row justify-between">
          <Image
            width={100}
            height={0}
            src={logoPath}
            alt="partner's logo"
            className="h-auto max-h-15 object-contain object-left brightness-[500%] grayscale sm:w-37.5"
          />
          <Newspaper className="h-6 w-6 stroke-white sm:h-10 sm:w-10" />
        </div>
        <div className="h5 font-semibold text-white max-sm:!text-[20px]">
          {imageText}
        </div>
      </div>
    </div>
  );
}

export function PartnershipStats({
  stat1,
  stat2,
  stat3,
  description1,
  description2,
  description3,
  gradientColor,
}: {
  stat1: string;
  stat2: string;
  stat3: string;
  description1: string;
  description2: string;
  description3: string;
  gradientColor: string;
}) {
  return (
    <div className="base:!flex base:!justify-around base:!flex-col base:max-w-62 base:!gap-y-0 flex flex-col justify-around gap-8 sm:grid sm:grid-cols-2 sm:gap-12 sm:gap-x-12 sm:gap-y-4">
      <PartnershipStat
        title={stat1}
        description={description1}
        gradientColor={gradientColor}
      />
      <PartnershipStat
        title={stat2}
        description={description2}
        gradientColor={gradientColor}
      />
      <PartnershipStat
        title={stat3}
        description={description3}
        gradientColor={gradientColor}
      />
    </div>
  );
}

export function PartnershipStat({
  title,
  description,
  gradientColor,
}: {
  title: string;
  description: string;
  gradientColor: string;
}) {
  return (
    <div className="max-base:flex-1/3">
      <div className="flex flex-row items-center">
        <div
          className="h-4 -translate-x-4 border-l-1 sm:h-5"
          style={{ borderLeftColor: `#${gradientColor}` }}
        />
        <h2 className="h6 font-bold max-sm:!text-[16px]">{title}</h2>
      </div>
      <p className="p text-neutral-500">{description}</p>
    </div>
  );
}
