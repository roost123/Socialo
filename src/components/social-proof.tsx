"use client";

import { ScrollReveal } from "./scroll-reveal";

export function SocialProof() {
  return (
    <div className="px-4 -mt-16 pb-8">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-warm-gray/60 font-light">
            Al getest door{" "}
            <span className="text-charcoal font-medium">12 bedrijven</span> in
            de horeca en retail in Nederland
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
