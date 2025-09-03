export function CTA() {
  return (
    <>
      <div className="flex h-[400px] flex-col items-center justify-center bg-gray-500/10">
        <div className="flex max-w-md flex-col items-center justify-center gap-6 text-center">
          <h2 className="text-[40px] leading-[1.1em] font-black tracking-[-0.03em]">
            Ready to elevate your next project?
          </h2>
          <p className="text-xl leading-[1.3em] font-bold tracking-[-0.03em]">
            Engineering, climate, water services, energy, your events and
            projects, fully handled.
          </p>
          <div className="flex gap-2">
            <button className="h-10 rounded-full bg-[#3F3F3F] px-4 font-bold text-white">
              Get a Quote
            </button>
            <button className="h-10 rounded-full border border-black bg-white px-4 font-bold text-black">
              Explore Partnerships
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
