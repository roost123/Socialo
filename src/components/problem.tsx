"use client";

import { AnimatedSection, StaggerContainer, StaggerItem, ParallaxSection } from "./animated-section";
import { Quotes } from "@phosphor-icons/react";

const frustrations = [
  {
    quote:
      "Every evening, our waitstaff explains the same menu to tourists who don\u2019t speak the language. Over and over. Table after table.",
    role: "Restaurant owner",
    accent: "#3b6eff",
  },
  {
    quote:
      "Every Monday I spend two hours building the weekly schedule. Texting people, shuffling shifts, checking contracts. It\u2019s the same puzzle every week.",
    role: "Hospitality manager",
    accent: "#a78bfa",
  },
  {
    quote:
      "Guests message us the same 15 questions every single day. What time is checkout? Is there parking? Can I get a late check-in? We answer them all by hand.",
    role: "Hotel front desk",
    accent: "#34d399",
  },
];

export function Problem() {
  return (
    <section className="py-28 md:py-40 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <p
              className="text-[13px] font-semibold uppercase tracking-[0.12em] mb-5"
              style={{ color: "var(--accent)" }}
            >
              The problem
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h2
              className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              Every business has
              <br />
              that one thing.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
            <p
              className="mt-6 text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              The task you do every week that makes you think: &ldquo;It&apos;s 2026, why am I still doing this?&rdquo;
            </p>
          </AnimatedSection>
        </div>

        <ParallaxSection offset={20}>
          <StaggerContainer className="mt-20 grid gap-5 md:grid-cols-3">
            {frustrations.map((item, i) => (
              <StaggerItem key={i}>
                <div
                  className="glass-card relative p-8 md:p-9 h-full transition-all duration-500 hover:-translate-y-1 group"
                >
                  {/* Accent line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-[2px] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: item.accent }}
                  />
                  <Quotes
                    size={28}
                    weight="fill"
                    className="mb-6 opacity-[0.15]"
                    style={{ color: item.accent }}
                  />
                  <p
                    className="text-[15px] md:text-base leading-[1.75]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: item.accent }}
                    >
                      {item.role[0]}
                    </div>
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ParallaxSection>
      </div>
    </section>
  );
}
