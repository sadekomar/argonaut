"use client";
import { ChevronRight, Fan, Newspaper, Wind } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { PartnersRow } from "@/components/partners-row";

export function StrategicPartnerships() {
  const [activePartner, setActivePartner] = useState("Halton");

  return (
    <div className="backgroundGrayGradient">
      <div className="flex w-full max-w-278 flex-col gap-11 sm:gap-16">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="h6 font-bold text-red-900">
            Strategic Partnerships
          </div>
          <h1 className="h3 font-semibold max-sm:!text-[31.25px]">
            Trading partners with industry leaders
          </h1>
          <p className="h6 font-medium opacity-70">
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
        <PartnerContent
          activePartner={activePartner}
          setActivePartner={setActivePartner}
        />
      </div>
    </div>
  );

  function PartnerContent({
    activePartner,
    setActivePartner,
  }: {
    activePartner: string;
    setActivePartner: (partner: string) => void;
  }) {
    const partnerData = {
      Halton: {
        stat1: "Advanced Dampers",
        stat2: "Air Distribution Systems",
        stat3: "Specialized Ventilation",
        description1:
          "Reliable dampers for tunnels, marine, and industrial ventilation.",
        description2:
          "Energy-efficient solutions that improve indoor air quality.",
        description3: "Custom systems built for demanding environments.",
        backgroundImagePath: "/halton-building.webp",
        logoPath: "/partners/halton-logo.png",
        imageText:
          "Learn how Halton powers sustainable indoor air solutions for our projects",
        gradientColor: "00AEEF",
      },
      Trane: {
        stat1: "VRF Systems",
        stat2: "Cooling Solutions",
        stat3: "Heating & Comfort",
        description1:
          "Reliable variable refrigerant flow systems for precise climate control.",
        description2:
          "Energy-efficient chillers and air conditioning systems for diverse facilities.",
        description3:
          "Trusted HVAC technologies ensuring consistent indoor environments.",
        backgroundImagePath: "/trane-image.jpeg",
        logoPath: "/partners/trane-logo.png",
        imageText:
          "Explore how Trane powers HVAC reliability in diverse environments",
        gradientColor: "FF2B00",
      },
      Enposs: {
        stat1: "Energy Optimization Devices",
        stat2: "Cost Savings",
        stat3: "Sustainability",
        description1:
          "Smart solutions that reduce HVAC and MEP energy consumption.",
        description2:
          "Proven technology that lowers operational expenses over time.",
        description3:
          "Environmentally conscious systems that support green initiatives.",
        backgroundImagePath: "/enposs-image.jpeg",
        logoPath: "/partners/enposs-logo.png",
        imageText:
          "Discover how Enposs reduces HVAC and MEP energy consumption",
        gradientColor: "F18103",
      },
      Volute: {
        stat1: "UL-Listed Fire Pumps",
        stat2: "High Reliability",
        stat3: "Safety Compliance",
        description1:
          "Certified fire safety pumps designed for critical applications.",
        description2:
          "Robust systems ensuring dependable fire protection performance.",
        description3:
          "Engineered to meet international safety and regulatory standards.",
        backgroundImagePath: "/volute-image.jpg",
        logoPath: "/partners/volute-logo.png",
        imageText:
          "Experience how Volute strengthens safety and reliability across our projects",
        gradientColor: "283C63",
      },
      RedShield: {
        stat1: "Accessible Fire Safety Solutions",
        stat2: "Accessible Protection",
        stat3: "Local Compliance",
        description1:
          "Cost-effective fire pump solutions approved by Egyptian Civil Defence.",
        description2:
          "Affordable options without compromising essential safety.",
        description3:
          "Designed to align with regional fire protection requirements.",
        backgroundImagePath: "/red-shield-image.jpg",
        logoPath: "/partners/red-shield-logo.png",
        imageText:
          "Explore how RedShield provides cost-effective fire protection systems",
        gradientColor: "BA302B",
      },
      Pitsan: {
        stat1: "Heavy-Duty Fans",
        stat2: "Durable Performance",
        stat3: "Commercial Applications",
        description1:
          "Industrial-grade fans built for oil & gas, tunnels, and factories.",
        description2:
          "Long-lasting ventilation solutions for demanding environments.",
        description3:
          "Reliable systems for large buildings and public facilities.",
        backgroundImagePath: "/pitsan-image.jpg",
        logoPath: "/partners/pitsan-logo.svg",
        imageText:
          "Uncover how Pitsan supports reliable airflow in oil, gas, and tunnel operations",
        gradientColor: "1E305E",
      },
      Gerpass: {
        stat1: "Cable Management Systems",
        stat2: "Oil & Gas Applications",
        stat3: "Infrastructure Reliability",
        description1:
          "Strong and efficient solutions for organizing and securing cables.",
        description2: "Designed to handle harsh industrial environments.",
        description3:
          "Enhances safety and performance across critical installations.",
        backgroundImagePath: "/gerpass-image.png",
        logoPath: "/partners/gerpass-logo.png",
        imageText:
          "Find out how Gerpaas delivers robust cable management for complex installations",
        gradientColor: "2C337F",
      },
    };

    const currentPartner =
      partnerData[activePartner as keyof typeof partnerData] ||
      partnerData.Halton;

    return (
      <>
        <div className="base:flex-row flex flex-col gap-8">
          <PartnershipStats
            stat1={currentPartner.stat1}
            stat2={currentPartner.stat2}
            stat3={currentPartner.stat3}
            description1={currentPartner.description1}
            description2={currentPartner.description2}
            description3={currentPartner.description3}
            gradientColor={currentPartner.gradientColor}
          />
          <PartnerLearnMore
            backgroundImagePath={currentPartner.backgroundImagePath}
            logoPath={currentPartner.logoPath}
            imageText={currentPartner.imageText}
            gradientColor={currentPartner.gradientColor}
          />
          <div className="base:hidden flex flex-row justify-center gap-2">
            <PartnerHorizontalLine active={true} />
            <PartnerHorizontalLine active={false} />
            <PartnerHorizontalLine active={false} />
            <PartnerHorizontalLine active={false} />
            <PartnerHorizontalLine active={false} />
          </div>
        </div>

        <div className="base:block hidden">
          <PartnersRow
            activePartner={activePartner}
            setActivePartner={setActivePartner}
          />
        </div>
      </>
    );
  }

  function PartnerHorizontalLine({ active }: { active: boolean }) {
    return (
      <hr
        className={`w-10 border-2 border-t ${active ? "border-sky-500" : "border-neutral-400"}`}
      />
    );
  }

  function PartnerLearnMore({
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
    const mobileGradient = `linear-gradient(180deg, #${gradientColor}90 0%, #${gradientColor}50 30%, #${gradientColor}90 60%, #${gradientColor} 100%)`;
    const desktopGradient = `linear-gradient(180deg, #${gradientColor}90 0%, #${gradientColor}20 30%, #${gradientColor}10 60%, #${gradientColor} 100%)`;

    return (
      <div className="relative w-full drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)]">
        <div className="relative">
          <Image
            width={0}
            height={0}
            src={backgroundImagePath}
            alt="Halton's Building"
            className="base:min-h-105 h-auto max-h-105 min-h-90 w-full rounded-xl object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 rounded-xl dark:bg-[#0078A320]"
            style={{ backgroundColor: `#${gradientColor}20` }}
          ></div>
          <div
            className="absolute inset-0 rounded-xl sm:hidden"
            style={{ background: mobileGradient }}
          ></div>
          <div
            className="absolute inset-0 hidden rounded-xl sm:block"
            style={{ background: desktopGradient }}
          ></div>
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

  function PartnershipStats({
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

    function PartnershipStat({
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
            ></div>
            <h2 className="h6 font-bold max-sm:!text-[16px]">{title}</h2>
          </div>

          <p className="p text-neutral-500">{description}</p>
        </div>
      );
    }
  }
}
