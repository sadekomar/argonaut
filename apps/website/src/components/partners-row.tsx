"use client";
import { Fragment } from "react";
import { DisplayedPartner } from "./partner-row-button";

export function PartnersRow({
  activePartner,
  setActivePartner,
}: {
  activePartner: string;
  setActivePartner: (partner: string) => void;
}) {
  const partners = [
    { image: "halton-logo.webp", name: "Halton" },
    { image: "trane-logo.webp", name: "Trane" },
    { image: "enposs-logo.webp", name: "Enposs" },
    { image: "volute-logo.webp", name: "Volute" },
    { image: "red-shield-logo.webp", name: "RedShield" },
    { image: "pitsan-logo.webp", name: "Pitsan" },
    { image: "gerpass-logo.webp", name: "Gerpass" },
  ];

  return (
    <div className="custom-dashed-border-top flex flex-row justify-around transition-all duration-500">
      {partners.map((partner, index) => (
        <Fragment key={partner.name}>
          <div className="transition-all duration-300">
            <DisplayedPartner
              image={partner.image}
              name={partner.name}
              grayscale={activePartner !== partner.name}
              onClick={() => setActivePartner(partner.name)}
            />
          </div>
          {index < partners.length - 1 && <DashedDivider />}
        </Fragment>
      ))}
    </div>
  );

  function DashedDivider() {
    return <div className="custom-dashed-border-right"></div>;
  }
}
