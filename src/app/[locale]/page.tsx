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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--btn-primary-bg)] focus:text-[var(--btn-primary-text)] focus:text-sm focus:font-medium focus:outline-none"
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
