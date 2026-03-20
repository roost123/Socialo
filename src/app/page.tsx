import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { WhatWeDo } from "@/components/what-we-do";
import { HowItWorks } from "@/components/how-it-works";
import { DemoPlaceholder } from "@/components/demo-placeholder";
import { WhySocialo } from "@/components/why-socialo";
import { ContactCTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhatWeDo />
        <HowItWorks />
        <DemoPlaceholder />
        <WhySocialo />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
