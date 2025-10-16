"use client";
import Image from "next/image";

export function DisplayedPartner({
  image,
  name,
  grayscale,
  onClick,
}: {
  image: string;
  name: string;
  grayscale?: boolean;
  onClick?: () => void;
}) {
  const needsBackground = name === "Gerpass";

  return (
    <button
      className={`flex cursor-pointer items-center px-8.75 pt-8 pb-4 transition-all duration-300 ${
        grayscale ? "opacity-60 grayscale" : "opacity-100 grayscale-0"
      }`}
      onClick={() => {
        onClick?.();
      }}
    >
      <div className="transition-transform duration-300">
        <Image
          width={130}
          height={0}
          src={`/partners/${image}`}
          alt={`${name}'s Logo`}
          className={`h-auto max-h-14 min-h-14 object-contain transition-all duration-300 ${
            needsBackground ? "invert filter" : ""
          }`}
        />
      </div>
    </button>
  );
}
