"use client";
import React, { useEffect, useRef, useState } from "react";
import { PartnersRow } from "@/components/partners-row";
import { partnerData, type PartnerData } from "@/data/partners";
import {
  PartnerBackground,
  PartnerCarouselTrack,
  PartnerIndicators,
} from "../../components//strategic-partnerships-components/partner-components";

interface UsePartnerCarouselReturn {
  activePartner: string;
  activeIndex: number;
  trackRef: React.RefObject<HTMLDivElement | null>;
  goToPartner: (partnerName: string) => void;
}

export function usePartnerCarousel(): UsePartnerCarouselReturn {
  const [activePartner, setActivePartner] = useState("Halton");
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastActiveIndex = useRef(-1);

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

  const handleScroll = () => {
    const currentActiveIndex = getActiveIndex();
    if (currentActiveIndex === lastActiveIndex.current) return;

    lastActiveIndex.current = currentActiveIndex;
    setActiveIndex(currentActiveIndex);

    const activePartnerName = partnerData[currentActiveIndex]?.name;
    if (activePartnerName && activePartnerName !== activePartner) {
      setActivePartner(activePartnerName);
    }
  };

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [partnerData, activePartner]);

  return {
    activePartner,
    activeIndex,
    trackRef,
    goToPartner,
  };
}

export function PartnerCarousel({
  partnerData,
  trackRef,
  goToPartner,
  activePartner,
  activeIndex,
}: {
  partnerData: PartnerData[];
  trackRef: React.RefObject<HTMLDivElement | null>;
  goToPartner: (partner: string) => void;
  activePartner: string;
  activeIndex: number;
}) {
  return (
    <div className="relative">
      <PartnerBackground partnerData={partnerData} activeIndex={activeIndex} />
      <PartnerCarouselTrack partnerData={partnerData} trackRef={trackRef} />
      <PartnerIndicators
        partnerData={partnerData}
        activePartner={activePartner}
      />
      <div className="base:block mt-8 hidden">
        <PartnersRow
          activePartner={activePartner}
          setActivePartner={goToPartner}
        />
      </div>
    </div>
  );
}

// Export a wrapper component that uses the hook
export function PartnerCarouselClient() {
  const { activePartner, activeIndex, trackRef, goToPartner } =
    usePartnerCarousel();

  return (
    <PartnerCarousel
      partnerData={partnerData}
      trackRef={trackRef}
      goToPartner={goToPartner}
      activePartner={activePartner}
      activeIndex={activeIndex}
    />
  );
}
