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
      className={`flex items-center px-8.75 pt-8 pb-4 ${grayscale ? "grayscale" : ""}`}
      onClick={() => {
        onClick?.();
      }}
    >
      <div>
        <Image
          width={130}
          height={0}
          src={`/partners/${image}`}
          alt={`${name}'s Logo`}
          className={`h-auto max-h-14 min-h-14 object-contain ${needsBackground ? "invert filter" : ""}`}
        />
      </div>
    </button>
  );
}
