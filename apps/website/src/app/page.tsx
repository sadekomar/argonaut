import { NavBar } from "./(home)/(components)/navbar";
import { Hero } from "./(home)/(components)/hero";
import { Footer } from "./(home)/(components)/footer";
import { CTA } from "./(home)/(components)/cta-section";
import { TrustedByEgyptsTopCompanies } from "./(home)/(components)/trusted-by-egypts-top-companies";
import { StrategicPartnerships } from "./(home)/(components)/strategic-partnerships";
import { Services } from "./(home)/(components)/services";
import { Stats } from "./(home)/(components)/stats";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <StrategicPartnerships />
      <Services />
      {/* <Stats /> */}
      <TrustedByEgyptsTopCompanies />
      <CTA />
      <Footer />
    </>
  );
}
