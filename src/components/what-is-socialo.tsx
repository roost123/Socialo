"use client";

import { AnimatedSection } from "./animated-section";

export function WhatIsSocialo() {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.15]"
            style={{ color: "var(--text-primary)" }}
          >
            We take repetitive work and make it disappear.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="mt-10 space-y-5">
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Socialo builds automations for small and medium businesses. Not big
              enterprise software. Not chatbots pretending to be people. Just
              clean, simple solutions that handle the tasks you&apos;re tired of
              doing manually.
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              You don&apos;t need to understand AI to use what we build. You just need
              to be tired of wasting time on the same thing every week.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
