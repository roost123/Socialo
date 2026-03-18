"use client";

import { ScrollReveal } from "./scroll-reveal";

export function WhatIsSocialo() {
  return (
    <section id="what" className="px-4 py-28 md:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
            What is Socialo
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal mb-10">
            We take repetitive work
            <br />
            and make it disappear.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-6 text-lg text-warm-gray leading-relaxed font-light">
            <p>
              Socialo builds automations for small and medium businesses. Not big
              enterprise software. Not chatbots pretending to be people. Just
              clean, simple solutions that handle the tasks you&apos;re tired of
              doing manually.
            </p>
            <p>
              You don&apos;t need to understand AI to use what we build. You just
              need to be tired of wasting time on the same thing every week.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
