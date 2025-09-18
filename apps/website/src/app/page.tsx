import { Hero } from "./(home)/(components)/hero";
import { CTA } from "./(home)/(components)/cta-section";
import { TrustedByEgyptsTopCompanies } from "./(home)/(components)/trusted-by-egypts-top-companies";
import { StrategicPartnerships } from "./(home)/(components)/strategic-partnerships";
// import { Stats } from "./(home)/(components)/stats";
import { OurColorsOurValues } from "./(home)/(components)/our-colors-our-values";
import { SeminarCountdown } from "./(home)/(components)/seminar-countdown";
import { TwoBusinessArms } from "./(home)/(components)/two-business-arms";
import { Services } from "./(home)/(components)/services";

export default function Home() {
  return (
    <>
      <Hero />
      <TwoBusinessArms />
      <StrategicPartnerships />
      <Services />
      {/* <Stats /> */}
      <TrustedByEgyptsTopCompanies />
      <OurColorsOurValues />
      <CTA />
    </>
  );
}
