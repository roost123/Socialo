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
      <Navbar />
      <main>
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
