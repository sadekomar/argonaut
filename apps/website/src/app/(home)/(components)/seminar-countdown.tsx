"use client";

import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

export function SeminarCountdown() {
  // countdown timer thing
  // number of days
  // hours
  // minutes

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Set target date to 2025-09-17 at 17:00 (5pm) local time
      const targetDate = new Date(2025, 8, 17, 17, 0, 0, 0); // Month is 0-indexed
      const timeDifference = targetDate.getTime() - now.getTime();
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="justify-left relative flex min-h-[480px] w-full items-center overflow-hidden px-20">
      <Image
        src="/seminar.webp"
        alt="Argonaut"
        fill
        priority
        className="absolute inset-0 -z-10 w-full object-cover"
      />
      <div className="items-left z-10 mx-auto flex max-w-[648px] flex-col justify-center gap-10 px-4">
        <h2 className="h2 font-bold text-white">Back to Market Seminar</h2>
        <p className="h5 max-w-[460px] text-left font-semibold text-white">
          Join us on the 17th of September in&nbsp;
          <span className="font-bold">Le Meridien Cairo Airport</span>
        </p>
        <div className="mx-auto flex items-center gap-4 text-white">
          <div className="flex flex-col items-center border-x border-white px-4">
            <span className="text-4xl font-bold">{days}</span>
            <span className="text-sm">Days</span>
          </div>
          <div className="flex flex-col items-center border-x border-white px-4">
            <span className="text-4xl font-bold">{hours}</span>
            <span className="text-sm">Hours</span>
          </div>
          <div className="flex flex-col items-center border-x border-white px-4">
            <span className="text-4xl font-bold">{minutes}</span>
            <span className="text-sm">Minutes</span>
          </div>
          <div className="flex flex-col items-center border-x border-white px-4">
            <span className="text-4xl font-bold">{seconds}</span>
            <span className="text-sm">Seconds</span>
          </div>
        </div>
        <div>
          <a
            href="https://www.google.com/calendar/render?action=TEMPLATE&text=ENGINEERING+THE+FUTURE+OF+AIR+%26+ENERGY&dates=20250917T170000/20250917T220000&location=Le+M%C3%A9ridien+Cairo+Airport%2C+%D8%B4%D8%A7%D8%B1%D8%B9+%D9%85%D8%B7%D8%A7%D8%B1%D8%8C%D8%8C%2C+Sheraton+Al+Matar%2C+El+Nozha%2C+Cairo+Governorate+4475001%2C+Egypt&pli=1&uid=dc@argonaut.com.eg&sf=true&output=xml"
            target="_blank"
            rel="noopener noreferrer"
            className="p mx-auto flex h-10 w-fit items-center justify-center rounded-full bg-white px-8 font-bold text-black"
          >
            Add to Calendar
          </a>
        </div>
      </div>
    </section>
  );
}
