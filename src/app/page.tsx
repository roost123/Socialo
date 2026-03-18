import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { WhatIsSocialo } from "@/components/what-is-socialo";
import { Examples } from "@/components/examples";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhatIsSocialo />
        <Examples />
        <CTA />
      </main>
    </>
  );
}
