"use client";

import {
  InnovationVector,
  InnovationTextVector,
  ReliabilityVector,
  ReliabilityTextVector,
  SustainabilityVector,
  SustainabilityTextVector,
} from "./vectors";
import Image from "next/image";
import { useState, useEffect } from "react";

export function OurColorsOurValues() {
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const [counter, setCounter] = useState(0);

  const values: {
    title: string;
    textVector: React.FC<{ className: string }>;
    icon: React.FC<{ className: string }>;
    description: string;
    angle: string;
  }[] = [
    {
      title: "Innovation",
      textVector: InnovationTextVector,
      icon: InnovationVector,
      angle: "40",
      description:
        "We pursue innovation with a fiery drive and fierce determination, constantly challenging the status quo to create bold, breakthrough solutions that set new standards in our industry.",
    },
    {
      title: "Reliability",
      textVector: ReliabilityTextVector,
      icon: ReliabilityVector,
      angle: "160",
      description:
        "Our clients count on us to deliver on time, on budget, and to the highest standards. We ensure performance and consistency with our work at every stage.",
    },
    {
      title: "Sustainability",
      textVector: SustainabilityTextVector,
      icon: SustainabilityVector,
      angle: "280",
      description:
        "We are committed to sustainability, reducing our environmental impact, and supporting the communities we serve.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValueIndex((prevIndex) => (prevIndex + 1) % values.length);
      setCounter((prevCounter) => prevCounter + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [values.length]);

  const currentValue = values[currentValueIndex];

  return (
    <section className="relative overflow-hidden bg-gray-200">
      <h2 className="h2 px-4 py-4 text-center font-bold">
        Our Colors, Our Values
      </h2>
      <div className="flex flex-col lg:flex-row">
        {/* Logo - Hidden on mobile, visible on larger screens */}
        <Image
          src={"/logo-large.webp"}
          height={400}
          width={400}
          alt="Argonaut logo"
          style={{
            transform: `rotate(${40 + counter * 120}deg)`,
            transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="absolute top-30 -left-[200px] hidden lg:block"
        />
        <Image
          src={"/logo-large.webp"}
          height={200}
          width={200}
          alt="Argonaut logo"
          style={{
            transform: `rotate(${40 + counter * 120}deg)`,
            transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="absolute top-30 left-[-100] block lg:hidden"
        />

        {/* Content Area */}
        <div className="relative flex min-h-[440px] w-full items-end justify-end px-4 py-4 lg:px-80">
          {/* Vectors - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:block">
            <currentValue.textVector className="absolute top-0 right-20" />
            <currentValue.icon className="absolute top-40 right-20" />
          </div>

          <div className="w-full max-w-md lg:w-[460px] lg:max-w-none">
            <p
              style={{ fontWeight: 600 }}
              className="h6 flex min-h-[200px] w-full items-center justify-center rounded-2xl bg-gray-500/10 px-4 text-center font-bold backdrop-blur-3xl lg:min-h-[300px] lg:rounded-4xl lg:px-8 lg:text-left"
            >
              {currentValue.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
