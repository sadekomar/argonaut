import Image from "next/image";

export function SeminarCountdown() {
  return (
    <section className="justify-left relative flex min-h-[480px] w-full items-center overflow-hidden px-20">
      <Image
        src="/seminar.png"
        alt="Argonaut"
        fill
        priority
        className="absolute inset-0 -z-10 w-full object-cover"
      />
      <div className="items-left z-10 mx-auto flex max-w-[648px] flex-col justify-center gap-10 px-4">
        <h2 className="h2 font-bold text-white">Back to Market Seminar</h2>
        <p className="h5 max-w-[460px] text-left font-semibold text-white">
          Join us on the 17th of September in Le Meridien
        </p>
        <a
          href="https://www.google.com/calendar/render?action=TEMPLATE&text=Back+to+Market+Seminar&dates=20250917T100000Z/20250917T110000Z&location=Le+M%C3%A9ridien+Cairo&pli=1&uid=argonaut@gmail.com&sf=true&output=xml"
          target="_blank"
          rel="noopener noreferrer"
          className="p mx-auto flex h-10 w-fit items-center justify-center rounded-full bg-white px-8 font-bold text-black"
        >
          Add to Calendar
        </a>
      </div>
    </section>
  );
}
