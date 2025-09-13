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
    { image: "halton-logo.png", name: "Halton" },
    { image: "trane-logo.png", name: "Trane" },
    { image: "enposs-logo.png", name: "Enposs" },
    { image: "volute-logo.png", name: "Volute" },
    { image: "red-shield-logo.png", name: "RedShield" },
    { image: "pitsan-logo.png", name: "Pitsan" },
    { image: "gerpass-logo.png", name: "Gerpass" },
  ];

  return (
    <div className="custom-dashed-border-top flex flex-row justify-around">
      {partners.map((partner, index) => (
        <Fragment key={partner.name}>
          <DisplayedPartner
            image={partner.image}
            name={partner.name}
            grayscale={activePartner !== partner.name}
            onClick={() => setActivePartner(partner.name)}
          />
          {index < partners.length - 1 && <DashedDivider />}
        </Fragment>
      ))}
    </div>
  );

  function DashedDivider() {
    return <div className="custom-dashed-border-right"></div>;
  }
}
