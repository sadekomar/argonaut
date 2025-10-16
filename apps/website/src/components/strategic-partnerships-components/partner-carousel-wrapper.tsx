"use client";

import { partnerData } from "@/data/partners";
import { usePartnerCarousel, PartnerCarousel } from "./partner-carousel-client";

export function PartnerCarouselWrapper() {
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
