import { NavBar } from "./(home)/(components)/navbar";
import { Hero } from "./(home)/(components)/hero";
import { Footer } from "./(home)/(components)/footer";
import { CTA } from "./(home)/(components)/cta-section";
import { TrustedByEgyptsTopCompanies } from "./(home)/(components)/trusted-by-egypts-top-companies";
import { StrategicPartnerships } from "./(home)/(components)/strategic-partnerships";
import { FullEPCForMEPSection } from "./(home)/(components)/full-epc-for-mep";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <FullEPCForMEPSection />
      <StrategicPartnerships />
      <TrustedByEgyptsTopCompanies />
      <CTA />
      <Footer />
    </>
  );
}
