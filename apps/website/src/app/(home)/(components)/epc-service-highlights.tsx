"use client";
import SpotlightCard from "@/components/spotlight-card";
import {
  ClipboardCheck,
  DraftingCompass,
  Handshake,
  HardHat,
} from "lucide-react";
import React from "react";

export default function EPCServiceHighlights() {
  return (
    <div className="mt-8 box-border grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
      <SpotlightCard
        Icon={DraftingCompass}
        title="Engineering Design & 3D Modeling"
      />
      <SpotlightCard Icon={Handshake} title="Procurement & Vendor Management" />
      <SpotlightCard
        Icon={HardHat}
        title="On-site Construction & Quality Control"
      />
      <SpotlightCard Icon={ClipboardCheck} title="Testing & Commissioning" />
    </div>
  );
}
