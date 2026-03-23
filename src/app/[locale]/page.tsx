import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { WhatWeDo } from "@/components/what-we-do";
import { Voorbeelden } from "@/components/voorbeelden";
import { HowItWorks } from "@/components/how-it-works";
import { WhySocialo } from "@/components/why-socialo";
import { Persoonlijk } from "@/components/persoonlijk";
import { ChatFab } from "@/components/chat-fab";
import { Footer } from "@/components/footer";
import { VerticalThread } from "@/components/vertical-thread";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute -top-full left-4 z-[60] px-4 py-2 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm font-medium outline-none opacity-0 pointer-events-none focus-visible:fixed focus-visible:top-4 focus-visible:opacity-100 focus-visible:pointer-events-auto transition-opacity"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <div className="relative">
          <VerticalThread />
          <Problem />
          <WhatWeDo />
          <Voorbeelden />
          <HowItWorks />
          <WhySocialo />
          <Persoonlijk />
        </div>
      </main>
      <Footer />
      <ChatFab />
    </>
  );
}
