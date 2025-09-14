"use client";
import { Newspaper } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PartnersRow } from "@/components/partners-row";

export function StrategicPartnerships() {
  const [activePartner, setActivePartner] = useState("Halton");
  const trackRef = useRef<HTMLDivElement>(null);
  const lastActiveIndex = useRef(-1);

  // Partner data with brand colors
  const partnerData = [
    {
      name: "Halton",
      stat1: "Advanced Dampers",
      stat2: "Air Distribution Systems",
      stat3: "Specialized Ventilation",
      description1:
        "Reliable dampers for tunnels, marine, and industrial ventilation.",
      description2:
        "Energy-efficient solutions that improve indoor air quality.",
      description3: "Custom systems built for demanding environments.",
      backgroundImagePath: "/halton-building.webp",
      logoPath: "/partners/halton-logo.webp",
      imageText:
        "Learn how Halton powers sustainable indoor air solutions for our projects",
      gradientColor: "00AEEF",
    },
    {
      name: "Trane",
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
      logoPath: "/partners/trane-logo.webp",
      imageText:
        "Explore how Trane powers HVAC reliability in diverse environments",
      gradientColor: "FF2B00",
    },
    {
      name: "Enposs",
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
      logoPath: "/partners/enposs-logo.webp",
      imageText: "Discover how Enposs reduces HVAC and MEP energy consumption",
      gradientColor: "F18103",
    },
    {
      name: "Volute",
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
      logoPath: "/partners/volute-logo.webp",
      imageText:
        "Experience how Volute strengthens safety and reliability across our projects",
      gradientColor: "283C63",
    },
    {
      name: "RedShield",
      stat1: "Accessible Fire Safety Solutions",
      stat2: "Accessible Protection",
      stat3: "Local Compliance",
      description1:
        "Cost-effective fire pump solutions approved by Egyptian Civil Defence.",
      description2: "Affordable options without compromising essential safety.",
      description3:
        "Designed to align with regional fire protection requirements.",
      backgroundImagePath: "/red-shield-image.jpg",
      logoPath: "/partners/red-shield-logo.webp",
      imageText:
        "Explore how RedShield provides cost-effective fire protection systems",
      gradientColor: "BA302B",
    },
    {
      name: "Pitsan",
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
    {
      name: "Gerpass",
      stat1: "Cable Management Systems",
      stat2: "Oil & Gas Applications",
      stat3: "Infrastructure Reliability",
      description1:
        "Strong and efficient solutions for organizing and securing cables.",
      description2: "Designed to handle harsh industrial environments.",
      description3:
        "Enhances safety and performance across critical installations.",
      backgroundImagePath: "/gerpass-image.png",
      logoPath: "/partners/gerpass-logo.webp",
      imageText:
        "Find out how Gerpaas delivers robust cable management for complex installations",
      gradientColor: "2C337F",
    },
  ];

  // Function to get active slide index based on scroll position
  const getActiveIndex = () => {
    if (!trackRef.current) return 0;
    const track = trackRef.current;
    const center = track.scrollLeft + track.clientWidth / 2;
    const slides = Array.from(track.children);

    let best = 0;
    let bestDist = Infinity;

    slides.forEach((slide, i) => {
      const element = slide as HTMLElement;
      const mid = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(mid - center);
      if (distance < bestDist) {
        bestDist = distance;
        best = i;
      }
    });

    return best;
  };

  // Handle scroll events to update active partner
  const handleScroll = () => {
    const activeIndex = getActiveIndex();
    if (activeIndex === lastActiveIndex.current) return;
    lastActiveIndex.current = activeIndex;

    const activePartnerName = partnerData[activeIndex]?.name;
    if (activePartnerName && activePartnerName !== activePartner) {
      setActivePartner(activePartnerName);
    }

    // Update background opacity
    const backgrounds = document.querySelectorAll("[data-bg]");
    backgrounds.forEach((bg, idx) => {
      const element = bg as HTMLElement;
      if (idx === activeIndex) {
        element.classList.remove("opacity-0", "z-[1]");
        element.classList.add("opacity-100", "z-[3]");
      } else {
        element.classList.remove("opacity-100", "z-[3]");
        element.classList.add(
          "opacity-0",
          idx < activeIndex ? "z-[2]" : "z-[1]",
        );
      }
    });
  };

  // Handle wheel events for better desktop experience
  const handleWheel = (e: WheelEvent) => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const atStart = track.scrollLeft <= 0;
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    const verticalIntent = Math.abs(e.deltaY) > Math.abs(e.deltaX);

    if (
      verticalIntent &&
      !(atStart && e.deltaY < 0) &&
      !(atEnd && e.deltaY > 0)
    ) {
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    }
  };

  // Function to navigate to specific partner
  const goToPartner = (partnerName: string) => {
    const index = partnerData.findIndex((p) => p.name === partnerName);
    if (index === -1 || !trackRef.current) return;

    const track = trackRef.current;
    const slides = Array.from(track.children);
    const target = slides[index] as HTMLElement;

    if (target) {
      const left =
        target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    }
  };

  // Setup event listeners
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", handleScroll, { passive: true });
    track.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleScroll);

    // Initialize
    handleScroll();

    return () => {
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleScroll);
    };
  }, [partnerData, activePartner]);

  return (
    <div className="backgroundGrayGradient">
      <div className="flex w-full max-w-278 flex-col gap-11 sm:gap-16">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="h6 font-bold text-red-900">
            Strategic Partnerships
          </div>
          <h1 className="h3 font-semibold max-sm:!text-[31.25px]">
            Trading Partners with Industry Leaders
          </h1>
          <p className="h6 font-medium opacity-70">
            We supply HVAC, fire safety, and MEP equipment with fast delivery
            and commissioning support, helping contractors and integrators
            achieve reliable system performance across oil & gas, industrial,
            marine, and commercial projects.
          </p>
        </div>
        <PartnerCarousel
          partnerData={partnerData}
          trackRef={trackRef}
          goToPartner={goToPartner}
          activePartner={activePartner}
        />
      </div>
    </div>
  );
}

interface PartnerData {
  name: string;
  stat1: string;
  stat2: string;
  stat3: string;
  description1: string;
  description2: string;
  description3: string;
  backgroundImagePath: string;
  logoPath: string;
  imageText: string;
  gradientColor: string;
}

function PartnerCarousel({
  partnerData,
  trackRef,
  goToPartner,
  activePartner,
}: {
  partnerData: PartnerData[];
  trackRef: React.RefObject<HTMLDivElement | null>;
  goToPartner: (partner: string) => void;
  activePartner: string;
}) {
  return (
    <div className="relative">
      {/* Background stack - decoupled from content */}
      <div className="absolute inset-0 -z-10">
        {partnerData.map((partner, index) => (
          <div
            key={`bg-${partner.name}`}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === 0 ? "z-[3] opacity-100" : "z-[1] opacity-0"
            }`}
            data-bg={index}
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

      {/* Horizontal scroll track */}
      <div className="">
        <div
          ref={trackRef}
          className="flex min-h-[410px] w-full touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      {/* Mobile indicators */}
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

      {/* Desktop navigation */}
      <div className="base:block mt-8 hidden">
        <PartnersRow
          activePartner={activePartner}
          setActivePartner={goToPartner}
        />
      </div>
    </div>
  );
}

function PartnerSlideContent({ partner }: { partner: PartnerData }) {
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

function PartnerHorizontalLine({
  active,
  gradientColor,
}: {
  active: boolean;
  gradientColor?: string;
}) {
  return (
    <hr
      className={`w-10 border-2 border-t transition-colors duration-300 ${
        active ? "" : "border-neutral-400"
      }`}
      style={
        active && gradientColor ? { borderColor: `#${gradientColor}` } : {}
      }
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
  return (
    <div className="relative w-full">
      {/* <div className="relative w-full drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)]"> */}
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
}

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
        />
        <h2 className="h6 font-bold max-sm:!text-[16px]">{title}</h2>
      </div>
      <p className="p text-neutral-500">{description}</p>
    </div>
  );
}
