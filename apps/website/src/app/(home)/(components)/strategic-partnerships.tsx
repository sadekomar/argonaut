import React from "react";
import { PartnerHeader } from "../../../components/strategic-partnerships-components/partner-components";
import { PartnerCarouselClient } from "../../../components/strategic-partnerships-components/partner-carousel-client";

export function StrategicPartnerships() {
  return (
    <div className="backgroundGrayGradient">
      <div className="mx-auto flex w-full max-w-278 flex-col gap-11 sm:gap-16">
        <PartnerHeader
          title="Strategic Partnerships"
          subtitle="Trading Partners with Industry Leaders"
          description="We supply HVAC, fire safety, and MEP equipment with fast delivery and commissioning support, helping contractors and integrators achieve reliable system performance across oil & gas, industrial, marine, and commercial projects."
        />
        <PartnerCarouselClient />
      </div>
    </div>
  );
}
