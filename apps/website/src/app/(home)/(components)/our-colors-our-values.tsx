import { InnovationVector } from "./vectors";
import { InnovationTextVector } from "./vectors";
import Image from "next/image";

export function OurColorsOurValues() {
  return (
    <section className="relative bg-gray-200 py-20">
      <h2 className="h2 text-center font-bold">Our Colors, Our Values</h2>
      <div className="flex">
        <Image
          src={"/logo.png"}
          height={600}
          width={600}
          alt="Argonaut logo"
          className="absolute top-30 -left-[250px] rotate-40"
        />
        <div className="relative flex w-full items-end justify-end px-80 py-40">
          <InnovationTextVector className="absolute top-10 right-20" />
          <InnovationVector className="absolute top-0 right-20 bottom-0 my-auto" />
          <p
            style={{ fontWeight: 600 }}
            className="h6 flex min-h-[300px] w-[460px] items-center justify-center rounded-4xl bg-gray-500/10 px-8 font-bold backdrop-blur-3xl"
          >
            We pursue innovation with a fiery drive and fierce determination,
            constantly challenging the status quo to create bold, breakthrough
            solutions that set new standards in our industry.
          </p>
        </div>
      </div>
    </section>
  );
}
