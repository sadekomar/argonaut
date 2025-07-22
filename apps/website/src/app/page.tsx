import Image from "next/image";
import argonautLogo from "./argonaut-white-vertical.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Image
            src={argonautLogo}
            alt="Argonaut Logo"
            priority
            className="mx-auto mb-4 w-[360px]"
          />
        </div>

        <div className="mb-12">
          <h2 className="text-xl md:text-3xl font-light text-gray-200 mb-8">
            Coming soon...
          </h2>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-6">
            Argonaut is growing younger, reigniting decades of expertise with a
            new edge.
          </p>

          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            As a key player in oil & gas and heavy industries, we&apos;re
            entering a bold new phase focused on mission-critical ventilation
            and engineered solutions.
          </p>

          <p className="text-lg md:text-xl font-medium text-white max-w-2xl mx-auto leading-relaxed italic">
            A legacy reborn. A future redefined.
          </p>
        </div>

        <div className="mt-16 text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Argonaut. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
