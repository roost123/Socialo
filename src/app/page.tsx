import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { WhatIsSocialo } from "@/components/what-is-socialo";
import { Examples } from "@/components/examples";
import { WhySocialo } from "@/components/why-socialo";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhatIsSocialo />
        <Examples />
        <WhySocialo />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
