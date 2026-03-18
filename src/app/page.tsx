import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { WhatIsSocialo } from "@/components/what-is-socialo";
import { Examples } from "@/components/examples";
import { Stats } from "@/components/stats";
import { WhySocialo } from "@/components/why-socialo";
import { FAQ } from "@/components/faq";
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
        <Stats />
        <WhySocialo />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
