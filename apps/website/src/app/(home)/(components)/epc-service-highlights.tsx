"use client";
import SpotlightCard from "@/components/spotlight-card";
import { Construction, Handshake, HardHat, Wrench } from "lucide-react";
import React from "react";

export default function EPCServiceHighlights() {
  return (
    <div className="mt-8 box-border grid h-full grid-cols-1 gap-4 sm:grid-cols-3">
      <SpotlightCard Icon={HardHat} title="Engineering" />
      <SpotlightCard Icon={Handshake} title="Procurement" />
      <SpotlightCard Icon={Construction} title="Construction" />
      <div className="sm:col-span-3">
        <SpotlightCard Icon={Wrench} title="Maintenance" className="h-full" />
      </div>
    </div>
  );
}
