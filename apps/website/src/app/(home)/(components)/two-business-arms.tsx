export function TwoBusinessArms() {
  return (
    <section className="my-10">
      <h2 className="h2 text-center font-bold">Two business arms</h2>
      <div className="mx-4 flex flex-col items-stretch justify-center gap-8 pt-4 pb-20 md:flex-row">
        <div className="items-left flex max-w-[460px] flex-col justify-between gap-4 rounded-[24px] border border-[#B9B9B9] bg-[#f0f0f0] p-10 shadow-[-110px_112px_63px_rgba(122,122,122,0.01),-62px_63px_53px_rgba(122,122,122,0.03),-28px_28px_39px_rgba(122,122,122,0.04),-7px_7px_22px_rgba(122,122,122,0.05)]">
          <h3 className="h3 font-bold">Trading</h3>
          <p className="p">
            We support contractors and integrators with commercial supply and
            commissioning of world-class MEP, HVAC, and fire safety equipment.
          </p>
        </div>
        <div className="items-left flex max-w-[460px] flex-col justify-between gap-4 rounded-[24px] border border-[#B9B9B9] bg-[#f0f0f0] p-10 shadow-[-110px_112px_63px_rgba(122,122,122,0.01),-62px_63px_53px_rgba(122,122,122,0.03),-28px_28px_39px_rgba(122,122,122,0.04),-7px_7px_22px_rgba(122,122,122,0.05)]">
          <h3 className="h3 font-bold">Services</h3>
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="h4 mb-2 font-bold">EPC</h4>
              <p className="p">
                We provide engineering, procurement, and construction to
                end-clients, delivering full MEP, HVAC, and fire safety
                projects.
              </p>
            </div>
            <div>
              <h4 className="h4 mb-2 font-bold">Maintenance</h4>
              <p className="p">
                We provide service and maintenance to ensure long-term
                reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
