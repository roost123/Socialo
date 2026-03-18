"use client";

import { AnimatedSection, ScaleOnScroll } from "./animated-section";
import { Lightning, Eye, Package } from "@phosphor-icons/react";

const pillars = [
  {
    icon: Lightning,
    title: "Start with the frustration",
    description: "We don\u2019t sell technology. We find the thing that eats your time and make it disappear.",
  },
  {
    icon: Eye,
    title: "You don\u2019t need to understand it",
    description: "No dashboards, no training, no setup calls. It just works — like it should have from the start.",
  },
  {
    icon: Package,
    title: "Small and concrete",
    description: "One problem, one solution. No bloated platforms. We solve the thing you\u2019re actually tired of.",
  },
];

export function WhatIsSocialo() {
  return (
    <section className="py-28 md:py-40 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, var(--accent), transparent)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <p
              className="text-[13px] font-semibold uppercase tracking-[0.12em] mb-5"
              style={{ color: "var(--accent)" }}
            >
              Our approach
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h2
              className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              We take repetitive work and make it disappear.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
            <p
              className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Socialo builds automations for small and medium businesses. Not big
              enterprise software. Not chatbots pretending to be people. Just
              clean, simple solutions.
            </p>
          </AnimatedSection>
        </div>

        <ScaleOnScroll>
          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div
                  className="glass-card relative p-8 md:p-9 h-full text-center transition-all duration-500 hover:-translate-y-1 group"
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: "var(--accent-soft)",
                      boxShadow: "var(--shadow-glow)",
                    }}
                  >
                    <pillar.icon
                      size={26}
                      weight="duotone"
                      style={{ color: "var(--accent)" }}
                    />
                  </div>
                  <h3
                    className="text-lg font-semibold tracking-[-0.02em] mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </ScaleOnScroll>
      </div>
    </section>
  );
}
