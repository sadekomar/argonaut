import { NavBar } from "./(home)/(components)/navbar";
import { Hero } from "./(home)/(components)/hero";
import { Footer } from "./(home)/(components)/footer";
import { CTA } from "./(home)/(components)/CTA";
import { TrustedByEgyptsTopCompanies } from "./(home)/(components)/TrustedByEgyptsTopCompanies";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />

      <TrustedByEgyptsTopCompanies />
      <CTA />
      <Footer />
    </>
  );
}
