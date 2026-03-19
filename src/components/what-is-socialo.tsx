"use client";

import { ScrollReveal } from "./scroll-reveal";

export function WhatIsSocialo() {
  return (
    <section id="what" className="px-4 py-28 md:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
            Wat is Socialo
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal mb-10">
            Wij pakken herhalend werk
            <br />
            en laten het verdwijnen.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-6 text-lg text-warm-gray leading-relaxed font-light">
            <p>
              Socialo bouwt automatiseringen voor het MKB. Geen groot
              enterprise-platform. Geen chatbots die doen alsof ze mensen zijn.
              Gewoon heldere, simpele oplossingen die de taken overnemen waar jij
              klaar mee bent.
            </p>
            <p>
              Je hoeft niks van AI te weten om te gebruiken wat wij bouwen. Je
              moet alleen moe zijn van elke week hetzelfde werk doen.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
