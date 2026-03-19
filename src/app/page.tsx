import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Problem } from "@/components/problem";
import { WhatIsSocialo } from "@/components/what-is-socialo";
import { Examples } from "@/components/examples";
import { Testimonials } from "@/components/testimonials";
import { Stats } from "@/components/stats";
import { WhySocialo } from "@/components/why-socialo";
import { FAQ } from "@/components/faq";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <WhatIsSocialo />
        <Examples />
        <Testimonials />
        <Stats />
        <WhySocialo />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
