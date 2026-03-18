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
      <main className="overflow-x-hidden">
        <Hero />
        <div className="h-px w-full max-w-5xl mx-auto" style={{ background: "var(--border)" }} />
        <Problem />
        <WhatIsSocialo />
        <div className="h-px w-full max-w-5xl mx-auto" style={{ background: "var(--border)" }} />
        <Examples />
        <CTA />
      </main>
    </>
  );
}
